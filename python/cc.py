import sys
from cc.cc_pred_ import main


with open(sys.argv[2], 'w') as out:
    try:
        y = main(sys.argv[1])
        out.write(str(y))
    except Exception as e:
        out.write("Error: " + str(e))

print("Done")
