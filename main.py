from flask import Flask, render_template, url_for, request, flash, redirect, session
from util import json_response

import os
import json

import data_handler

import password_hash

app = Flask(__name__)

app.secret_key = os.urandom(16)


@app.route("/")
def index():
    """
    This is a one-pager which shows all the boards and cards
    """
    return render_template('index.html')


@app.route("/login", methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        is_matching = False
        user_name = request.form['username']
        password = request.form['password']
        hashed_password = password_hash.hash_password(password)
        if user_name in [value['user_name'] for value in data_handler.get_all_user_names()]:
            is_matching = password_hash.verify_password(password,
                                                        data_handler.get_user_password(user_name)[0]['password'])
            if is_matching:
                session['username'] = user_name
                session['password'] = password
                return redirect('/')
            flash('Wrong username or password!')
            return redirect(url_for('login'))
        flash('Wrong username or password!')
        return redirect(url_for('login'))
    return render_template('login.html')


@app.route('/logout')
def logout():
    session.pop('username', None)
    session.pop('password', None)
    return redirect(url_for('index'))


@app.route("/registration", methods=['GET', 'POST'])
def registration():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        if username == '' or password == '':
            flash('Please, fill in both fields.')
            return redirect(url_for('registration'))

        if username not in [value['user_name'] for value in data_handler.get_all_user_names()]:
            hash_password = password_hash.hash_password(password)
            data_handler.registration(username, hash_password)
            return redirect('/login')
        else:
            flash('Username already exists, please choose another one!')
            return redirect(url_for('registration'))

    return render_template('registration.html')


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
@json_response
def rename_board(board_id):
    title = request.get_json()['title']

    data_handler.rename_board(title, board_id)

    return "Board renamed"


@app.route("/column/<int:status_id>", methods=["POST"])
@json_response
def rename_status(status_id):
    new_status = request.get_json()['title']

    data_handler.rename_status(new_status, status_id)

    return "Status renamed"


@app.route("/card/<int:card_id>", methods=["POST"])
@json_response
def rename_card(card_id):
    new_card = request.get_json()['title']
    data_handler.rename_card(new_card, card_id)

    return "Card renamed"


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


@app.route("/create-card", methods=["POST"])
@json_response
def create_card():
    board_id = request.get_json()['board_id']
    title = request.get_json()['title']
    column_id = data_handler.get_first_column(board_id)
    try:
        order = (data_handler.get_last_order(column_id)) + 1
    except TypeError:
        order = 0
    data_handler.create_card(board_id, column_id, title, order)

    return "New card saved"


@app.route('/card/<int:card_id>/position', methods=['POST'])
@json_response
def change_card_position(card_id):
    board_id = request.get_json()['boardId']
    status_id = request.get_json()['columnId']
    orders = request.get_json()['orders']
    cards_id = request.get_json()['cardsId']

    data_handler.update_card_status(card_id, board_id, status_id)
    for index in range(len(orders)):
        data_handler.update_cards_order(cards_id[index], orders[index])

    return 'Card position stored'


def main():
    app.run(debug=True, port=5000)

    # Serving the favicon
    with app.app_context():
        app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


if __name__ == '__main__':
    main()
