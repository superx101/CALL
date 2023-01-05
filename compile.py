#help to compile to js
import subprocess
import shutil
import os
import json

shutil.copytree("test", "nodejs/call/test", dirs_exist_ok=True)
shutil.copytree("templates", "nodejs/call/templates", dirs_exist_ok=True)
shutil.copytree("third-party", "nodejs/call/third-party", dirs_exist_ok=True)
shutil.copytree("config", "nodejs/call/config", dirs_exist_ok=True)
shutil.copytree("node_modules", "nodejs/call/node_modules", dirs_exist_ok=True)

with open("package.json", "r") as f:
    data = json.load(f)
del data['devDependencies']
with open('nodejs/CALL/package.json', "w") as f:
    json.dump(data, f)

os.system("tsc")
print('complete')