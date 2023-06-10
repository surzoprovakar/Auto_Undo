import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.neural_network import MLPClassifier

model = LogisticRegression()

data = np.array([[1, 2, 3], [6, 2, 8, 11], [10, 2, -4], [11, 22, 30, 25, 65], [0, 5, 7]], dtype=object)
labels = np.array(['true', 'false', 'true', 'false', 'true'])

# Predict the probability for the given input [3, 1, 8] with label 'true'
input_data = np.array([3, 1, 8]).reshape(1, -1)

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

print(f"The probability of the input {input_data} being classified as 'true' in LR is: {probability_true}")


clf = MLPClassifier(solver='lbfgs', alpha=1e-5,
                    hidden_layer_sizes=(5, 2), random_state=1)

clf.fit(padded_data, labels)

probabilities_mpl = clf.predict_proba(padded_input.reshape(1, -1))
# print(probabilities_mpl)
probability_mpl_true = probabilities_mpl[0][clf.classes_ == 'true']
print(f"The probability of the input {input_data} being classified as 'true' in MLP is: {probability_mpl_true}")