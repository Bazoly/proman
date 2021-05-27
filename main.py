from flask import Flask, render_template, url_for, request
from util import json_response

import json

import data_handler

app = Flask(__name__)


@app.route("/")
def index():
    """
    This is a one-pager which shows all the boards and cards
    """
    return render_template('index.html')


@app.route("/get-boards")
@json_response
def get_boards():
    """
    All the boards
    """
    return data_handler.get_boards_sql()


@app.route("/get-statuses/<int:board_id>")
@json_response
def get_statuses_for_board(board_id: int):
    return data_handler.get_statuses(board_id)


@app.route("/get-cards/<int:column_id>")
@json_response
def get_cards_for_board(column_id: int):
    """
    All cards that belongs to a board
    :param board_id: id of the parent board
    """
    return data_handler.get_cards_for_board(column_id)


@app.route("/create-boards", methods=["POST"])
@json_response
def create_board():
    board_name = request.get_json()['boardTitle']
    print(board_name)
    data_handler.create_new_board(board_name)
    return "New board created"


@app.route('/board/<int:board_id>', methods=['DELETE'])
@json_response
def delete_board(board_id):
    data_handler.delete_item_by_id('boards', board_id)

    return 'Board deleted'


@app.route('/card/<int:card_id>', methods=['DELETE'])
@json_response
def delete_card(card_id):
    data_handler.delete_item_by_id('cards', card_id)

    return 'Card deleted'


@app.route('/column/<int:column_id>', methods=['DELETE'])
@json_response
def delete_column(column_id):
    data_handler.delete_item_by_id('statuses', column_id)

    return 'Column deleted'


@app.route('/card/<int:card_id>/status', methods=['POST'])
@json_response
def change_card_status(card_id):
    board_id = request.get_json()['boardId']
    status_id = request.get_json()['columnId']

    data_handler.update_card_status(card_id, board_id, status_id)
    return 'Card status stored'


def main():
    app.run(debug=True)

    # Serving the favicon
    with app.app_context():
        app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


if __name__ == '__main__':
    main()
