import persistence
from psycopg2.extras import RealDictCursor
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
def get_boards_sql(cursor: RealDictCursor):
    query = f'SELECT id, title from boards'
    cursor.execute(query)
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
