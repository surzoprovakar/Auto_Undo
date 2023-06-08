import numpy as np
from sklearn.linear_model import LogisticRegression

model = LogisticRegression()


data = np.array([[1, 2, 3], [6, 2, 8, 11], [10, 2, -4], [11, 22, 30, 25, 65], [0, 5, 7]], dtype=object)
labels = np.array(['true', 'false', 'true', 'false', 'true'])

# Pre process data
max_len = max(len(sublist) for sublist in data)
padded_data = np.zeros((len(data), max_len), dtype=int)

for i, sublist in enumerate(data):
    padded_data[i, :len(sublist)] = sublist

# print(padded_data)


# fit the model to the training data
model.fit(padded_data, labels)

# Predict the probability for the given input [3, 1, 8] with label 'true'
input_data = np.array([3, 1, 8, 0, 0]).reshape(1, -1)
# print(input_data)
probabilities = model.predict_proba(input_data)

# print(probabilities)
probability_true = probabilities[0][model.classes_ == 'true']

print(f"The probability of the input {input_data} being classified as 'true' is: {probability_true}")