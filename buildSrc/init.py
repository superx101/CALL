import compile as c
import os
import shutil

# copy CALL to ../CALL
if os.path.exists("../CALL") == False:
    os.makedirs("../CALL")
shutil.copytree('CALL', '../CALL', dirs_exist_ok=True)

# run compile
c.run()
