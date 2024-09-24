from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

def calculate_drop_set(final_side_weight, bar_weight, percent_drop, unit):
    final_set_weight = (final_side_weight * 2) + bar_weight
    drop_side_weight = final_set_weight * (percent_drop / 100)
    remaining_weight = final_set_weight - drop_side_weight
    remaining_weight_per_side = (remaining_weight - bar_weight) / 2
    
    return {
        'final_set_weight': round(final_set_weight, 2),
        'drop_side_weight': round(drop_side_weight, 2),
        'remaining_weight': round(remaining_weight, 2),
        'remaining_weight_per_side': round(remaining_weight_per_side, 2),
        'unit': unit
    }

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/calculate', methods=['POST'])
def calculate():
    data = request.json
    
    try:
        bar_weight = float(data.get('barWeight', 45 if data['unit'] == 'lbs' else 20))
        final_side_weight = float(data['finalSideWeight'])
        percent_drop = float(data['percentDrop'])
        unit = data['unit']
        
        if final_side_weight <= 0 or percent_drop < 0 or percent_drop > 100:
            raise ValueError("Invalid input values")
        
        result = calculate_drop_set(final_side_weight, bar_weight, percent_drop, unit)
        return jsonify(result)
    except (ValueError, KeyError) as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
