from flask import Flask, request, jsonify
import torch
import numpy as np
from torchvision.transforms import transforms
from main import Net
app = Flask(__name__)
PATH = "../MNIST-model/mnist_cnn.pt"

model = Net().double()
model.load_state_dict(torch.load(PATH))

trans = transforms.Compose([
    transforms.ToTensor(),
])

@app.route('/predict', methods=['POST'])
def predict():
    body = request.get_json()
    img_array = np.asarray(body['indices'])
    img_array = trans(img_array)
    img_array = img_array.view(1,1,28,28)
    output = torch.exp(model(img_array.double()))
    return jsonify({"output": int(np.argmax(output.detach().numpy()))})


if __name__ == '__main__':
    app.run()