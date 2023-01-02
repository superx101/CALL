# help to create CALL-x.x.x.zip
import zipfile
import shutil
import os
import json

# run compile.py
with open('compile.py', "r") as f:
    code = f.read()
exec(code)

for root, dirs, files in os.walk("nodejs/call"):
    if "node_modules" in dirs:
        dirs.remove("node_modules")
    if "templates" in dirs:
        dirs.remove("templates")
    for file in files:
        if file.endswith(".js"):
            full_path = os.path.join(root, file)
            print(full_path)
            os.system("uglifyjs " + full_path + " -c -m -o " + full_path)

if os.path.exists("./output/temp") == False:
    os.makedirs("./output/temp")

#CALL.llplugin
with zipfile.ZipFile("./output/temp/CALL.llplugin", "w") as zip_file:
    for root, dirs, files in os.walk("./nodejs/call"):
        if "node_modules" in dirs:
            dirs.remove("node_modules")
        for file in files:
            if file not in ["package-lock.json"]:
                full_path = os.path.join(root, file)
                path = os.path.relpath(full_path, start="./nodejs/call")
                zip_file.write(full_path, path)

shutil.copytree('CALL', 'output/temp/CALL', dirs_exist_ok=True)

version = ''

#package.json
with open('./nodejs/call/package.json', encoding="utf-8") as f:
    data = json.load(f)
    version = data["version"]

#CALL-x.x.x.zip
zip_file = zipfile.ZipFile('./output/CALL-' + version + '.zip', 'w')
zip_file.writestr('安装说明.txt', '[安装]\n初次安装时需将CALL和CALL.llplugin放入plugins目录。\n\n[手动更新]\n手动更新安装时只需将CALL.llplugin放入plugins目录, 且更新替换CALL/plugin/下的形状包即可。\n\n[自动更新]\n可在配置中开启自动检查更新, 或在后台输入/call u 检查并自动更新')
# zip CALL/
for root, dirs, files in os.walk('output/temp/CALL'):
    for file in files:
        file_path = os.path.join(root, file)
        # 计算文件在压缩包中的路径
        arc_name = os.path.relpath(file_path, 'output/temp')
        zip_file.write(file_path, arc_name)

zip_file.writestr(zipfile.ZipInfo('CALL/temp/'), '')#创建空文件夹temp
zip_file.write('output/temp/CALL.llplugin', "CALL.llplugin", compress_type=zipfile.ZIP_DEFLATED)
zip_file.close()

shutil.rmtree("./output/temp")

print("packed")