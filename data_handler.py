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
    query = 'SELECT id, title FROM statuses WHERE board_id= (%(board_id)s) ORDER BY id ASC'
    cursor.execute(query, {'board_id': board_id})
    return cursor.fetchall()
