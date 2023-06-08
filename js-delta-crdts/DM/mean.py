import argparse
from statistics import mean

def mean_val(data):
    return mean(data)

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('numbers', type=int, nargs='+')
    args = parser.parse_args()
    
    result = mean_val(args.numbers)
    print(result)