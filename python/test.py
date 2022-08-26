import sys

print("Output from Python")
print(sys.argv[1])


with open(sys.argv[1], 'r') as inp:
    y = inp.read().upper()
with open(sys.argv[1], 'w') as out:
    out.write(y)
