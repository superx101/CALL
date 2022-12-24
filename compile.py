#help to compile to js
import subprocess
import shutil
import os
import json

shutil.copytree("test", "nodejs/CALL/test", dirs_exist_ok=True)
shutil.copytree("third-party", "nodejs/CALL/third-party", dirs_exist_ok=True)
shutil.copytree("config", "nodejs/CALL/config", dirs_exist_ok=True)
shutil.copytree("src/plugin/ShapeTemplates", "nodejs/CALL/src/plugin/ShapeTemplates", dirs_exist_ok=True)
# shutil.copy("package.json", "nodejs/CALL/package.json")
with open("package.json", "r") as f:
    data = json.load(f)
del data['dependencies']['@types/node']
with open('nodejs/CALL/package.json', "w") as f:
    json.dump(data, f)

os.system("tsc")

for root, dirs, files in os.walk("nodejs/CALL"):
    for file in files:
        if file.endswith(".js"):
            full_path = os.path.join(root, file)
            print(full_path)
            os.system("uglifyjs " + full_path + " -c -m -o " + full_path)
print('complete')