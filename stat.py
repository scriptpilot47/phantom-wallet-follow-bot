import json

completed = 0
failed = 0
running = 0
fresh = 0

with open('source/bots.json', 'r') as json_file:
    data = json.load(json_file)

for index, bot in enumerate(data):
    if len(bot['phrase'])== 1:
        print(f'phrase error bot: {bot['username']}')
    index += 1
    if bot['follow_started'] and bot['follow_finished']:
        completed += 1
    elif bot['follow_started'] and len(bot['following']) == 0:
        running += 1
    elif not bot['follow_started'] and not bot['follow_finished']:
        fresh += 1
    else:
        failed += 1

print('###################')
print(f'completed bots: {completed}')
print(f'fresh bots: {fresh}')
print(f'running bots: {running}')
print(f'failed bots: {failed}')
print('###################')