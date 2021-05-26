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


def main():
    app.run(debug=True, port=5000)

    # Serving the favicon
    with app.app_context():
        app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


if __name__ == '__main__':
    main()
