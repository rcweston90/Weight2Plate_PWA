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

def calculate_drop_set(final_side_weight, bar_weight, percent_drop):
    final_set_weight = (final_side_weight * 2) + bar_weight
    drop_side_weight = final_set_weight * (1 - percent_drop)
    remaining_weight = final_set_weight - drop_side_weight
    remaining_weight_per_side = (remaining_weight - bar_weight) / 2
    
    return {
        'final_set_weight': final_set_weight,
        'drop_side_weight': drop_side_weight,
        'remaining_weight': remaining_weight,
        'remaining_weight_per_side': remaining_weight_per_side
    }

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/calculate', methods=['POST'])
def calculate():
    data = request.json
    weight = float(data['weight'])
    bar_weight = float(data.get('barWeight', 45))

    if weight < bar_weight:
        return jsonify({'error': 'Weight must be greater than or equal to the bar weight'}), 400

    plates = calculate_plates(weight, bar_weight)
    
    result = {'plates': plates}

    if 'finalSideWeight' in data and 'percentDrop' in data:
        final_side_weight = float(data['finalSideWeight'])
        percent_drop = float(data['percentDrop']) / 100
        drop_set_results = calculate_drop_set(final_side_weight, bar_weight, percent_drop)
        result.update(drop_set_results)

    return jsonify(result)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
