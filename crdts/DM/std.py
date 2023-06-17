import argparse
from statistics import stdev

def std(data):
    return stdev(data)

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('numbers', type=int, nargs='+')
    args = parser.parse_args()
    
    result = std(args.numbers)
    print(result)