from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

def calculate_plates(weight, bar_weight=45):
    available_plates = [45, 35, 25, 10, 5, 2.5]
    plates = []
    remaining_weight = (weight - bar_weight) / 2

    for plate in available_plates:
        while remaining_weight >= plate:
            plates.append(plate)
            remaining_weight -= plate

    return plates

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/calculate', methods=['POST'])
def calculate():
    weight = float(request.json['weight'])
    bar_weight = float(request.json.get('barWeight', 45))

    if weight < bar_weight:
        return jsonify({'error': 'Weight must be greater than or equal to the bar weight'}), 400

    plates = calculate_plates(weight, bar_weight)
    return jsonify({'plates': plates})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
