from flask import Blueprint, jsonify, request
import json, logging, logging.config, sqlite3

with open("logging.json", "r") as logging_file:
    logging.config.dictConfig(json.load(logging_file))
logger = logging.getLogger(__name__.split('.')[0])

with open("config.json", "r") as config_file:
    app_config = json.load(config_file)

if ('feedback_table_name' in app_config):
    feedback_table_name = app_config['feedback_table_name']
else:
    feedback_table_name = 'feedback'


def create_db_connection():
    try:
        connection = sqlite3.connect(app_config['sqlite_db_file'])
        return connection
    except sqlite3.Error as e:
        logger.error(e.args[0])

# Create the table if it doesn't exist
dbconn = create_db_connection()
if dbconn is not None:
    cursor = dbconn.cursor()
    cursor.execute("SELECT * FROM sqlite_master WHERE type='table' AND name=:tablename",
                   {'tablename': feedback_table_name})
    if len(cursor.fetchall()) == 0:
        try:
            cursor.execute(
                "CREATE TABLE " + feedback_table_name + "(image_id INTEGER PRIMARY KEY, tags TEXT, misclassified_count INTEGER)")
            logger.debug("Table " + feedback_table_name + " created successfully")
            dbconn.commit()
        except sqlite3.Error as e:
            logger.error(e.args[0])
    cursor.close()
    dbconn.close()

db_service = Blueprint("db_service", __name__)


def create_feedback_entry_if_not_exists(dbcursor, imageid):
    dbcursor.execute("SELECT * FROM " + feedback_table_name + " WHERE image_id=:imgid", {'imgid': imageid})
    if len(dbcursor.fetchall()) == 0:
        try:
            dbcursor.execute(
                "INSERT INTO " + feedback_table_name + "(image_id, tags, misclassified_count) VALUES(?,?,?)",
                (imageid, "", 0))
        except sqlite3.Error as e:
            logger.error(e.args[0])


@db_service.route("/store/tags", methods=['POST'])
def store_tags():
    request_obj = request.get_json()
    images_id_array = request_obj['images_id_array']
    tags = request_obj['tags']

    dbconn_tags = create_db_connection()
    tag_cursor = dbconn_tags.cursor()

    for image_id in images_id_array:
        create_feedback_entry_if_not_exists(tag_cursor, image_id)
        tag_cursor.execute("SELECT tags FROM " + feedback_table_name + " where image_id=:imgid", {'imgid': image_id})
        existing_tags = tag_cursor.fetchone()[0]
        if len(existing_tags) == 0:
            newtags = tags
        else:
            newtags = existing_tags + ", " + tags
        try:
            tag_cursor.execute("UPDATE " + feedback_table_name + " SET tags=:newtags where image_id=:imgid",
                               {'newtags': newtags, 'imgid': image_id})
        except sqlite3.Error as e:
            logger.error(e.args[0])

    tag_cursor.close()
    dbconn_tags.commit()
    dbconn_tags.close()
    return jsonify(success=True)


@db_service.route("/store/misclassfiedimages", methods=['POST'])
def store_misclassifiedimages():
    request_obj = request.get_json()
    images_misclassified_array = request_obj['images_misclassified_array']
    dbconn_misclassified_images = create_db_connection()
    misclassifiedimages_cursor = dbconn_misclassified_images.cursor()

    for image_id in images_misclassified_array:
        create_feedback_entry_if_not_exists(misclassifiedimages_cursor, image_id)
        misclassifiedimages_cursor.execute(
            "SELECT misclassified_count FROM " + feedback_table_name + " where image_id=:imgid", {'imgid': image_id})
        misclassified_count = misclassifiedimages_cursor.fetchone()[0] + 1
        try:
            misclassifiedimages_cursor.execute(
                "UPDATE " + feedback_table_name + " SET misclassified_count=:count where image_id=:imgid",
                {'count': misclassified_count, 'imgid': image_id})
        except sqlite3.Error as e:
            logger.error(e.args[0])

    misclassifiedimages_cursor.close()
    dbconn_misclassified_images.commit()
    dbconn_misclassified_images.close()
    return jsonify(success=True)


logger.info("loaded: " + __name__)
