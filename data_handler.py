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
    query = 'SELECT id, title from boards'
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
    query = 'SELECT id, title FROM statuses WHERE board_id= (%(board_id)s)'
    cursor.execute(query, {'board_id': board_id})
    return cursor.fetchall()


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
def update_cards_order(cursor: RealDictCursor, status_id: int, orders: list):
    for order in orders:
        query = sql.SQL("""
                UPDATE cards
                SET 
                    "order" = %(order)s
                WHERE status_id = %(status_id)s
            """).format()

        dictionary = {
            'order': order,
            'status_id': status_id
        }

        cursor.execute(query, dictionary)
