#help to compile to js
import subprocess
import shutil
import os
import json

shutil.copytree("test", "nodejs/CALL/test", dirs_exist_ok=True)
shutil.copytree("templates", "nodejs/CALL/templates", dirs_exist_ok=True)
shutil.copytree("third-party", "nodejs/CALL/third-party", dirs_exist_ok=True)
shutil.copytree("config", "nodejs/CALL/config", dirs_exist_ok=True)

with open("package.json", "r") as f:
    data = json.load(f)
del data['dependencies']['@types/node']
with open('nodejs/CALL/package.json', "w") as f:
    json.dump(data, f)

os.system("tsc")
print('complete')