import sys

def add(a, b):
    print("the result is: ", a+b)
    return a+b

a = int(sys.argv[1])
b = int(sys.argv[2])

result = add(a, b)