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


def get_cards_for_board(board_id):
    persistence.clear_cache()
    all_cards = persistence.get_cards()
    matching_cards = []
    for card in all_cards:
        if card['board_id'] == str(board_id):
            card['status_id'] = get_card_status(card['status_id'])  # Set textual status for the card
            matching_cards.append(card)
    return matching_cards


@database_common.connection_handler
def delete_item_by_id(cursor: RealDictCursor, table_name: str, id: int):
    query = sql.SQL("""
        DELETE  FROM    {table_name}
        WHERE   id = %(id)s
    """).format(
        table_name=sql.Identifier(table_name)
    )
    cursor.execute(query, {'id': id})
