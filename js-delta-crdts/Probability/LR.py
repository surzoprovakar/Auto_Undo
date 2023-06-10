import numpy as np
from sklearn.linear_model import LogisticRegression
import sys
import json
import argparse

model = LogisticRegression()

def prob_val_lr(data, labels, input_data):

    # Pre process data
    max_len = max(len(sublist) for sublist in data)
    if max_len < len(input_data):
        max_len = len(input_data)

    padded_data = np.zeros((len(data), max_len), dtype=int)
    padded_input = np.zeros(max_len, dtype=int)
    padded_input[:len(input_data.flatten())] = input_data.flatten()

    for i, sublist in enumerate(data):
        padded_data[i, :len(sublist)] = sublist

    # fit the model to the training data
    model.fit(padded_data, labels)

    probabilities = model.predict_proba(padded_input.reshape(1, -1))

    # print(probabilities)
    probability_true = probabilities[0][model.classes_ == 'true']

    return probability_true

    # print(f"The probability of the input {input_data} being classified as 'true' in LR is: {probability_true}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('data', type=str)
    parser.add_argument('labels', type=str)
    parser.add_argument('input_data', type=str)
    args = parser.parse_args()

    data_array = json.loads(args.data)
    labels_array = json.loads(args.labels)
    input_data_array = json.loads(args.input_data)

    data_array = np.array(data_array, dtype=object)
    labels_array = np.array(labels_array, dtype=str)
    input_data_array = np.array(input_data_array).reshape(1, -1)
    
    result = prob_val_lr(data_array, labels_array, input_data_array)
    print(result)


# data = np.array([[1, 2, 3], [6, 2, 8, 11], [10, 2, -4], [11, 22, 30, 25, 65], [0, 5, 7]], dtype=object)
# labels = np.array(['true', 'false', 'true', 'false', 'true'])

#     # Predict the probability for the given input [3, 1, 8] with label 'true'
# input_data = np.array([3, 1, 8]).reshape(1, -1)

# prob_val_lr(data, labels, input_data)
