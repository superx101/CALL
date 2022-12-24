#help to create CALL-x.x.x.zip
import zipfile
import shutil
import os
import json

#run compile.py
with open('compile.py', "r") as f:
    code = f.read()
exec(code)

if os.path.exists("./output/temp") == False:
    os.makedirs("./output/temp")

with zipfile.ZipFile("./output/temp/CALL.llplugin", "w") as zip_file:
    for root, dirs, files in os.walk("./nodejs/call"):
        for file in files:
            if file not in ["node_modules", "package-lock.json"] and not root.startswith("./nodejs/call/node_modules"):
                full_path = os.path.join(root, file)
                zip_file.write(full_path)

shutil.copytree('CALL', 'output/temp/CALL', dirs_exist_ok=True)

version = ''

with open('./nodejs/call/package.json', encoding="utf-8") as f:
    print(f)
    data = json.load(f)
    version = data["version"]

zip_file = zipfile.ZipFile('./output/CALL-' + version +  '.zip','w')
zip_file.write('./output/temp',compress_type=zipfile.ZIP_DEFLATED)

shutil.rmtree("./output/temp")

print("packed")