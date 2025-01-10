import random
import json
import requests
import time

def random_time():
    """Return a random time between 5 and 10 seconds."""
    return random.uniform(5, 10)

def follow_actor(headers, this_bot_id, target_actor_id):
    '''send a follow post request to follow an actor by an actor'''
    url = f"https://api.phantom.app/v1/actors/{this_bot_id}/outbox"

    payload = {
        "@context": "https://www.w3.org/ns/activitystreams",
        "type": "Follow",
        "object": f"https://api.phantom.app/v1/actors/{target_actor_id}",
        "actor": f"https://api.phantom.app/v1/actors/{this_bot_id}",
    }

    response = requests.post(url, headers=headers, json=payload)
    return response.status_code

def start_bot(headers):
    # fetch this bots data
    response = requests.get('http://127.0.0.1:5000/next-bot')
    data = response.json()
    alfa_bot_username = data['username']
    alfa_bot_id = data['actor_id']
    success_following = []
    error_count = 0
    bot_stopped = False


    # read the targets to follow
    with open('source/bots.json', 'r') as json_file:
        bots = json.load(json_file)

    # writing started indicator in json
    for item in bots:
        if item['username'] == alfa_bot_username:
            item['follow_started'] = True
    with open('source/bots.json', 'w') as json_file:
        json.dump(bots, json_file, indent=4)

    # follwing the targets
    already_following = data['following']
    for index, target_bot in enumerate(bots):
        # check if previous session targets left
        if len(already_following) > 0:
            skip = False
            for username in already_following:
                if username == target_bot['username']:
                    print(f'bot #{alfa_bot_username}: round {index + 1} skipping already followed acc!')
                    skip = True
            if skip:
                continue

        # random sleep
        rnd_one = random_time()
        time.sleep(rnd_one)
        print('')
        print(f'##############################################')
        print(f'bot #{alfa_bot_username}: slept for {rnd_one}')
        print(f'bot #{alfa_bot_username}: round {index + 1}')
        print(f'bot #{alfa_bot_username}: next target is {target_bot['username']}')

        if target_bot['username'] == alfa_bot_username:
            index += 1
            print(f'bot #{alfa_bot_username}: round {index + 1} skipping own acc!')
            continue
        else:
            # starting the follow POST request

            # check if the target has actor id saved
            if target_bot['actor_id']:
                target_actor_id = target_bot['actor_id']
            else:
                fetch_actor_id = get_actor_id(target_bot['username'], headers=headers)
                if fetch_actor_id['type'] == 'error':
                    print(f'bot #{alfa_bot_username}: error while fetching {target_bot['username']}')

                elif fetch_actor_id['type'] == 'success':
                    target_actor_id = fetch_actor_id['message']

                    # update the json file with the actor id
                    with open('source/bots.json', 'r') as json_file:
                        data = json.load(json_file)

                    for item in data:
                        if item['username'] == target_bot['username']:
                            item['actor_id'] = target_actor_id

                    with open('source/bots.json', 'w') as json_file:
                        json.dump(data, json_file, indent=4)

                    time.sleep(5)

            result = follow_actor(headers, alfa_bot_id, target_actor_id)

            # check the result
            if result == 201:
                print(f'bot #{alfa_bot_username}: {result}')
                print(f'bot #{alfa_bot_username}: success following {target_bot['username']}')
                success_following.append(target_bot['username'])

            else:
                print(f'bot #{alfa_bot_username}: hit an error: {result}')
                error_count += 1

                # check for error count
                if error_count == 5:
                    # read the fresh JSON file
                    with open('source/bots.json', 'r') as json_file:
                        data = json.load(json_file)

                    for item in data:
                        if item['username'] == alfa_bot_username:
                            item['following'] = success_following

                    with open('source/bots.json', 'w') as json_file:
                        json.dump(data, json_file, indent=4)

                    print(f'bot #{alfa_bot_username}: bot hit {error_count} errors!')
                    print(f'bot #{alfa_bot_username}: stopping...')
                    print(f'bot #{alfa_bot_username}: followed accounts saved into the JSON')
                    print(f'##############################################')
                    bot_stopped = True
                    break
            index += 1
        print(f'##############################################')
    
    # writing total success in the json data
    if not bot_stopped:
        # read the fresh JSON file
        with open('source/bots.json', 'r') as json_file:
            bots = json.load(json_file)

        for item in bots:
            if item['username'] == alfa_bot_username:
                item['follow_finished'] = True
                item['following'] = []

        with open('source/bots.json', 'w') as json_file:
            json.dump(bots, json_file, indent=4)


def adjust_username_followed(username, failed_at):
    '''if something fails'''
    with open('source/bots.json', 'r') as json_file:
        data = json.load(json_file)

    user_index = ''
    for index, item in enumerate(data):
        if item['username'] == username:
            user_index = index
        index += 1

    

    i = 0
    for item in range(failed_at-1):
        data[user_index]['following'].append(data[i]['username'])
        i += 1

    with open('source/bots.json', 'w') as json_file:
        json.dump(data, json_file, indent=4)


def get_actor_id(username, headers):
    '''send a request to phantom servers to get the actor of a username'''
    url = "https://api.phantom.app/v1/actors-search"
    params = {
        "query": username
    }
    ##
    print(headers)
    ##
    response = requests.get(url, headers=headers, params=params)
    if response.status_code == 200:
        pass
    else:
        return {
            'message': f'error while fetching the actor id...({response.status_code})',
            'type': 'error'
        }

    data = response.headers


    # credits to chat gpt for the json decoder

    # Decode the content as UTF-8
    decoded_content = response.content.decode('utf-8')

    # Parse the JSON
    try:
        data = json.loads(decoded_content)

        # extract target actor
        base_url = 'https://api.phantom.app/v1/actors/'
        target_actor_url = data['actors'][0]['id']
        target_actor_id = target_actor_url.replace(base_url, '')
        print(target_actor_id)
        return {
            'message': target_actor_id,
            'type': 'success'
        }
    
    except json.JSONDecodeError as e:
        return {
            'message': f'JSON decode error: {e}',
            'type': 'error'
        }
    
