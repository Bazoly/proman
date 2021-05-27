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
    data_handler.create_new_board(board_name)
    board_id = data_handler.get_board_id()
    data_handler.append_status_columns(board_id)
    return "New board created"


@app.route("/rename/<int:board_id>", methods=["POST"])
def rename_board(board_id):
    title = request.get_json()['title']

    data_handler.rename_board(title, board_id)


@app.route("/column/<int:status_id>", methods=["POST"])
@json_response
def rename_status(status_id):
    #status_id = request.get_json()["status_id"]
    #
    # print(status_id)
    new_status = request.get_json()['title']
    #status_id = data['status_id']
    print(new_status)
    data_handler.rename_status(new_status, status_id)

    return "ok"


def main():
    app.run(debug=True, port=5000)

    # Serving the favicon
    with app.app_context():
        app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


if __name__ == '__main__':
    main()
