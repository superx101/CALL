#help to compile to js
import shutil
import os
import json

root = os.path.join("..", "nodejs", "call")

def run():
    # copy files
    shutil.copytree("test", os.path.join(root, "test"), dirs_exist_ok=True)
    shutil.copytree("templates", os.path.join(root, "templates"), dirs_exist_ok=True)
    shutil.copytree("third-party", os.path.join(root, "third-party"), dirs_exist_ok=True)
    shutil.copytree("config", os.path.join(root, "config"), dirs_exist_ok=True)
    shutil.copytree("node_modules", os.path.join(root, "node_modules"), dirs_exist_ok=True)

    # delete devDependencies
    with open("package.json", "r") as f:
        data = json.load(f)
    del data['devDependencies']
    with open(os.path.join(root, 'package.json'), "w") as f:
        json.dump(data, f)

    os.system("tsc")
    print('complie complete')
    
run()