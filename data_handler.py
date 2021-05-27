import persistence
from psycopg2.extras import RealDictCursor
from psycopg2 import sql
from typing import List, Dict

import database_common


def get_card_status(status_id):
    """
    Find the first status matching the given id
    :param status_id:
    :return: str
    """
    statuses = persistence.get_statuses()
    return next((status['title'] for status in statuses if status['id'] == str(status_id)), 'Unknown')


def get_boards():
    """
    Gather all boards
    :return:
    """
    return persistence.get_boards(force=True)


@database_common.connection_handler
def get_cards_for_board(cursor: RealDictCursor, column_id):
    query = 'SELECT id, title, "order" FROM cards WHERE status_id= (%(column_id)s)'
    cursor.execute(query, {'column_id': column_id})
    return cursor.fetchall()


@database_common.connection_handler
def get_boards_sql(cursor: RealDictCursor):
    query = 'SELECT id, title from boards ORDER BY id DESC'
    cursor.execute(query)
    return cursor.fetchall()


@database_common.connection_handler
def create_new_board(cursor: RealDictCursor, board_name):
    query = """
    INSERT INTO boards (title)
    VALUES (%(board_name)s)
    """
    cursor.execute(query, {'board_name': board_name})


@database_common.connection_handler
def get_statuses(cursor: RealDictCursor, board_id):
    query = 'SELECT id, title FROM statuses WHERE board_id= (%(board_id)s) ORDER BY id ASC'
    cursor.execute(query, {'board_id': board_id})
    return cursor.fetchall()


@database_common.connection_handler
def append_status_columns(cursor: RealDictCursor, board_id):
    query = """
    INSERT INTO statuses(board_id, title) VALUES (%(board_id)s, 'new');
    INSERT INTO statuses(board_id, title) VALUES (%(board_id)s, 'in progress');
    INSERT INTO statuses(board_id, title) VALUES (%(board_id)s, 'testing');
    INSERT INTO statuses(board_id, title) VALUES (%(board_id)s, 'done');
    """
    cursor.execute(query, {'board_id': board_id})


@database_common.connection_handler
def get_board_id(cursor: RealDictCursor):
    query = """
    SELECT MAX(id) FROM boards;
    """
    cursor.execute(query)
    return cursor.fetchone()['max']


@database_common.connection_handler
def rename_board(cursor: RealDictCursor, title, board_id):
    query = '''
    UPDATE boards
    SET title = %(title)s
    WHERE id = %(id)s'''
    cursor.execute(query, {"title": title, "id": board_id})


@database_common.connection_handler

def create_card(cursor: RealDictCursor, board_id, column_id, order):
    query = '''
    INSERT INTO cards (board_id, status_id, title, "order")
    VALUES (%(board_id)s, %(column_id)s, 'awesome new card', %(order)s)'''
    cursor.execute(query, {"board_id": board_id, "column_id": column_id, 'order': order})
    return None


@database_common.connection_handler
def get_first_column(cursor: RealDictCursor, board_id):
    query = 'SELECT MIN(id) FROM statuses WHERE board_id = %(board_id)s'
    cursor.execute(query, {'board_id': board_id} )
    return cursor.fetchone()['min']


@database_common.connection_handler
def get_last_order(cursor: RealDictCursor, column_id):
    query = 'SELECT MAX("order") FROM cards WHERE status_id= %(column_id)s'
    cursor.execute(query, {'column_id': column_id})
    return cursor.fetchone()['max']

def rename_status(cursor: RealDictCursor, new_status, status_id):
    query = '''
    UPDATE statuses
    SET title = %(new_status)s
    WHERE id = %(status_id)s'''
    cursor.execute(query, {"new_status": new_status, "status_id": status_id})


@database_common.connection_handler
def rename_card(cursor: RealDictCursor, new_card, card_id):
    query = '''
    UPDATE cards
    SET title = %(new_card)s
    WHERE id = %(card_id)s'''
    cursor.execute(query, {"new_card": new_card, "card_id": card_id})



@database_common.connection_handler
def delete_item_by_id(cursor: RealDictCursor, table_name: str, id: int):
    query = sql.SQL("""
        DELETE  FROM    {table_name}
        WHERE   id = %(id)s
    """).format(
        table_name=sql.Identifier(table_name)
    )
    cursor.execute(query, {'id': id})


@database_common.connection_handler
def update_card_status(cursor: RealDictCursor, id: int, board_id: int, status_id: int):
    query = sql.SQL("""
        UPDATE cards
        SET 
            board_id = %(board_id)s,
            status_id = %(status_id)s
        WHERE id = %(id)s
    """).format()

    dictionary = {
        'board_id': board_id,
        'status_id': status_id,
        'id': id
    }

    cursor.execute(query, dictionary)


@database_common.connection_handler
def update_cards_order(cursor: RealDictCursor, card_id: int, order: int):
    query = sql.SQL("""
            UPDATE cards
            SET 
                "order" = %(order)s
            WHERE id = %(card_id)s
        """).format()

    dictionary = {
        'order': order,
        'card_id': card_id,
    }

    cursor.execute(query, dictionary)


@database_common.connection_handler
def registration(cursor: RealDictCursor, username, password):
    query = """INSERT INTO users (user_name, password, registration_date)
               VALUES (%(email)s, %(pw)s , NOW()::timestamp(0));
    """
    cursor.execute(query, {'email': username, 'pw': password})


@database_common.connection_handler
def get_all_user_names(cursor: RealDictCursor):
    query = 'SELECT user_name from users'
    cursor.execute(query)
    return cursor.fetchall()


@database_common.connection_handler
def get_user_password(cursor: RealDictCursor, email):
    query = 'SELECT password FROM USERS WHERE user_name = %(email)s'
    cursor.execute(query, {'email': email})
    return cursor.fetchall()
