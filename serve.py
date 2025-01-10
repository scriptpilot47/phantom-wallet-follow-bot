import json

current = 0 # reset after 2

# read the bots
bots_file = 'source/bots.json'
with open(bots_file, 'r') as json_file:
    bots = json.load(json_file)

def send_bot():
    '''returns a new bot every time'''
    global current
    target_bot = bots[0]
    while target_bot['follow_finished']:
        bots.remove(target_bot)
        target_bot = bots[0]

    current += 1
    message = f'served bot: {target_bot['username']}\n for {current} time!'

    if current == 2:
        bots.remove(target_bot)
        target_bot['bots_left'] = len(bots)
        current = 0


    return target_bot