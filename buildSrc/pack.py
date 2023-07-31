# help to create CALL-x.x.x.zip and dependencies
import zipfile
import shutil
import os
import json

# run compile
import compile as c 

# compact code
for root, dirs, files in os.walk(c.root):
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
    for root, dirs, files in os.walk(c.root):
        if "node_modules" in dirs:
            dirs.remove("node_modules")
        for file in files:
            if file not in ["package-lock.json"]:
                full_path = os.path.join(root, file)
                path = os.path.relpath(full_path, start=c.root)
                zip_file.write(full_path, path)

shutil.copytree('CALL', 'output/temp/CALL', dirs_exist_ok=True)

version = ''

# read version
with open(os.path.join (c.root, 'package.json'), encoding="utf-8") as f:
    data = json.load(f)
    version = data["version"]

emptyPaths = ["temp", "import", "export"]

# make CALL-x.x.x.zip
zip_file = zipfile.ZipFile('./output/CALL-' + version + '.zip', 'w')
zip_file.writestr('安装更新注意事项(必读)-README.txt',
                '''
                [Installation]
                    First time installation, you need to put CALL and CALL.llplugin into the plugins directory. 
                [Manual Update]
                    Manual update installation only needs to put CALL.llplugin into the plugins directory, and update and replace files under CALL/plugin/. 
                [Auto Update]
                    Check for updates automatically can be enabled in the configuration, or enter /call u in the background to check for updates automatically. 
                [Failure to load plugin after update]
                    This situation means the dependency is incomplete, please input ll load ". /plugins/nodejs/call/bin/CALL_Dependencise.js" to check and update the dependency 
                [Failure to install the solution]
                    When there is a message "Execute "npm install"... for plugin call", it means that the progress bar is not moving. when the progress bar has not been moving, it means that the current network environment can not download the dependencies, you need to manually download the dependency package and install, download address: https://gitee.com/superx101/CALL/releases
                  
                [安装]
                    初次安装时需将CALL和CALL.llplugin放入plugins目录。
                [手动更新]
                    手动更新安装时只需将CALL.llplugin放入plugins目录, 且更新替换CALL/plugin/下的文件即可。
                [自动更新]
                    可在配置中开启自动检查更新, 或在后台输入/call u 检查并自动更新。
                [更新后报错加载插件失败]
                    该情况说明依赖不全, 请在后台输入 ll load "./plugins/nodejs/call/bin/CALL_Dependencise.js" 检查并更新依赖
                [无法安装解决办法]
                    当出现 “为插件 call 执行 "npm install"...” 时进度条一直不动, 说明当前网络环境无法下载依赖, 需要手动下载依赖包并安装, 下载地址: https://gitee.com/superx101/CALL/releases
                ''')
# zip CALL/
for root, dirs, files in os.walk('output/temp/CALL'):
    dirs[:] = [d for d in dirs if d not in emptyPaths]
    for file in files:
        file_path = os.path.join(root, file)
        # 计算文件在压缩包中的路径
        arc_name = os.path.relpath(file_path, 'output/temp')
        zip_file.write(file_path, arc_name)

for i in emptyPaths:
    zip_file.writestr(zipfile.ZipInfo('CALL/' + i + "/"), '')#create temp
zip_file.write('output/temp/CALL.llplugin', "CALL.llplugin", compress_type=zipfile.ZIP_DEFLATED)
zip_file.close()

# make dependencies
with zipfile.ZipFile('output/' + version + '依赖包.zip', 'w') as zip:
    for root, dirs, files in os.walk('node_modules/'):
        if "@types" in dirs:
            dirs.remove("@types")
        for file in files:
            file_path = os.path.join(root, file)
            arcname = os.path.join('node_modules', os.path.relpath(file_path, 'node_modules/'))
            zip.write(file_path, arcname=arcname)
    zip.write('package-lock.json', "package-lock.json")
    zip.writestr('依赖包安装说明 install introduction.txt', 
                '''
                [Note]
                    If you can't download the dependency for the first time, you need to download the dependency package manually.
                [Installation]
                    Extract the node_modules and package-lock.json files to plugins/nodejs/call.
                
                [说明]
                    初次安装无法下载依赖时, 需手动下载该依赖包补充。
                [安装]
                    将里面的node_modules和package-lock.json文件解压到 plugins/nodejs/call 下即可
                ''')

shutil.rmtree("./output/temp")

print("pack complete")