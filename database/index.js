const mysql = require('mysql');

const DATABASE_IP = 'localhost';
const DATABASE_PORT = '3306';
const DATABASE_NAME = 'messenger';
const DATABASE_USER = 'root';
const DATABASE_PASSWORD = 'root';

const USERS_TABLE_NAME = 'users';
const CONVERSATIONS_TABLE_NAME = 'conversations';
const MESSAGES_TABLE_NAME = 'messages';
const CONTACTS_TABLE_NAME = 'contacts';
const INVITATIONS_TABLE_NAME = 'invitations';

const pool = mysql.createPool({
    connectionLimit: 15,
    multipleStatements: true,
    host: DATABASE_IP,
    port: DATABASE_PORT,
    user: DATABASE_USER,
    password: DATABASE_PASSWORD,
    insecureAuth: true
});

const USE_DATABASE_SQL = `USE ${DATABASE_NAME}`;
const CREATE_DATABASE_SQL = `CREATE DATABASE IF NOT EXISTS ${DATABASE_NAME}`;
const CREATE_USERS_TABLE_SQL = `CREATE TABLE IF NOT EXISTS ${USERS_TABLE_NAME} 
    (
        id INT NOT NULL AUTO_INCREMENT, 
        PRIMARY KEY(id), 
        username VARCHAR(30) UNIQUE, 
        password VARCHAR(60), 
        email VARCHAR(30) UNIQUE,
        bio VARCHAR(250)
    )`;
const CREATE_CONVERSATIONS_TABLE_SQL = `CREATE TABLE IF NOT EXISTS ${CONVERSATIONS_TABLE_NAME} 
    (
        id INT NOT NULL AUTO_INCREMENT,
        creatorID INT NOT NULL, 
        conversationName VARCHAR(30),
        PRIMARY KEY(id)
    )`;
const CREATE_MESSAGES_TABLE_SQL = `CREATE TABLE IF NOT EXISTS ${MESSAGES_TABLE_NAME} 
    (
        id INT NOT NULL AUTO_INCREMENT,
        conversationID INT NOT NULL,
        authorID INT NOT NULL,
        timeStamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        messageText VARCHAR(250),
        FOREIGN KEY(conversationID) REFERENCES conversations (id),
        FOREIGN KEY(authorID) REFERENCES users (id),
        PRIMARY KEY(id)
    )`;

// status enum values: 0 is automatically assigned for error value, pending = 1, accepted = 2
const CREATE_CONTACTS_TABLE_SQL = `CREATE TABLE IF NOT EXISTS ${CONTACTS_TABLE_NAME} 
(
    user1ID INT NOT NULL,
    user2ID INT NOT NULL,
    FOREIGN KEY(user1ID) REFERENCES users(id),
    FOREIGN KEY(user2ID) REFERENCES users(id),
    PRIMARY KEY(user1ID, user2ID)
)`;

const CREATE_INVITATIONS_TABLE_SQL = `CREATE TABLE IF NOT EXISTS ${INVITATIONS_TABLE_NAME} 
(
    senderID INT NOT NULL,
    receiverID INT NOT NULL,
    FOREIGN KEY(senderID) REFERENCES users (id),
    FOREIGN KEY(receiverID) REFERENCES users (id),
    PRIMARY KEY(senderID, receiverID)
)`;

const GET_USER_SQL = `SELECT * FROM ${USERS_TABLE_NAME} WHERE email = (?)`;
const GET_USER_BY_ID_SQL = `SELECT * FROM ${USERS_TABLE_NAME} WHERE id = (?)`;
const GET_CONVERSATION_BY_ID_SQL = `SELECT * FROM ${CONVERSATIONS_TABLE_NAME} WHERE id = (?)`;
const GET_CONVERSATIONS_BY_CREATOR_ID_SQL = `SELECT * FROM ${CONVERSATIONS_TABLE_NAME} WHERE creatorID = (?)`;

const GET_MESSAGES_BY_CONVERSATION_ID_SQL = `SELECT ${MESSAGES_TABLE_NAME}.*, ${USERS_TABLE_NAME}.username AS authorUsername
    FROM ${MESSAGES_TABLE_NAME}
    INNER JOIN ${CONVERSATIONS_TABLE_NAME} 
        ON ${MESSAGES_TABLE_NAME}.conversationID = ${CONVERSATIONS_TABLE_NAME}.id
    INNER JOIN ${USERS_TABLE_NAME} 
        ON ${MESSAGES_TABLE_NAME}.authorID = ${USERS_TABLE_NAME}.id
    WHERE ${MESSAGES_TABLE_NAME}.conversationID = (?)`;

const GET_MESSAGE_BY_ID_SQL = `SELECT ${MESSAGES_TABLE_NAME}.*, ${USERS_TABLE_NAME}.username AS authorUsername
    FROM ${MESSAGES_TABLE_NAME} 
    INNER JOIN ${USERS_TABLE_NAME} 
        ON ${MESSAGES_TABLE_NAME}.authorID = ${USERS_TABLE_NAME}.id
    WHERE ${MESSAGES_TABLE_NAME}.id = (?)`;

const GET_USERS_BY_SEARCH_SQL = `SELECT ${USERS_TABLE_NAME}.*, ${CONTACTS_TABLE_NAME}.*
    FROM ${USERS_TABLE_NAME} 
    LEFT JOIN ${CONTACTS_TABLE_NAME}
        ON (
            (${CONTACTS_TABLE_NAME}.senderID = (?) AND ${CONTACTS_TABLE_NAME}.receiverID = ${USERS_TABLE_NAME}.id) OR
            (${CONTACTS_TABLE_NAME}.senderID = ${USERS_TABLE_NAME}.id AND ${CONTACTS_TABLE_NAME}.receiverID = (?)))
    WHERE ((email LIKE CONCAT('%', (?), '%') OR username LIKE CONCAT('%', (?), '%')) AND id != (?) )`;

const GET_CONTACTS_BY_SEARCH_SQL = `SELECT ${CONTACTS_TABLE_NAME}.*, 
        sender.username AS senderUsername, sender.email AS senderEmail,
        receiver.username AS receiverUsername, receiver.email AS receiverEmail
    FROM ${CONTACTS_TABLE_NAME} 
    INNER JOIN ${USERS_TABLE_NAME} AS sender 
        ON ${CONTACTS_TABLE_NAME}.senderID = sender.id
    INNER JOIN ${USERS_TABLE_NAME} AS receiver 
        ON ${CONTACTS_TABLE_NAME}.receiverID = receiver.id
    WHERE((email LIKE CONCAT('%', ( ? ), '%') OR username LIKE CONCAT('%', ( ? ), '%')) AND id != ( ? ))`;
//WHERE(${CONTACTS_TABLE_NAME}.status = 2 AND (sender.id = (?) OR receiver.id = (?)))`;

const GET_CONTACTS_SQL = `SELECT ${CONTACTS_TABLE_NAME}.*, 
        sender.username AS senderUsername, sender.email AS senderEmail,
        receiver.username AS receiverUsername, receiver.email AS receiverEmail
    FROM ${CONTACTS_TABLE_NAME} 
    INNER JOIN ${USERS_TABLE_NAME} AS sender 
        ON ${CONTACTS_TABLE_NAME}.senderID = sender.id
    INNER JOIN ${USERS_TABLE_NAME} AS receiver 
        ON ${CONTACTS_TABLE_NAME}.receiverID = receiver.id
    WHERE(${CONTACTS_TABLE_NAME}.status = 2 AND (sender.id = (?) OR receiver.id = (?)))`;

const GET_SENT_INVITATIONS_SQL = `SELECT ${CONTACTS_TABLE_NAME}.*, 
        sender.username AS senderUsername, sender.email AS senderEmail,
        receiver.username AS receiverUsername, receiver.email AS receiverEmail
    FROM ${CONTACTS_TABLE_NAME} 
    INNER JOIN ${USERS_TABLE_NAME} AS sender 
        ON ${CONTACTS_TABLE_NAME}.senderID = sender.id
    INNER JOIN ${USERS_TABLE_NAME} AS receiver 
        ON ${CONTACTS_TABLE_NAME}.receiverID = receiver.id
    WHERE (${CONTACTS_TABLE_NAME}.status = 'pending' AND sender.id = (?))`;

const GET_RECEIVED_INVITATIONS_SQL = `SELECT ${CONTACTS_TABLE_NAME}.*, 
        sender.username AS senderUsername, sender.email AS senderEmail,
        receiver.username AS receiverUsername, receiver.email AS receiverEmail
    FROM ${CONTACTS_TABLE_NAME} 
    INNER JOIN ${USERS_TABLE_NAME} AS sender 
        ON ${CONTACTS_TABLE_NAME}.senderID = sender.id
    INNER JOIN ${USERS_TABLE_NAME} AS receiver 
        ON ${CONTACTS_TABLE_NAME}.receiverID = receiver.id
    WHERE (${CONTACTS_TABLE_NAME}.status = 'pending' AND receiver.id = (?))`;

const CREATE_USER_SQL = `INSERT INTO ${USERS_TABLE_NAME} (username, password, email, bio) VALUES (?)`;
const CREATE_MESSAGE_SQL = `INSERT INTO ${MESSAGES_TABLE_NAME} (conversationID, authorID, messageText) VALUES (?)`;
const CREATE_CONVERSATION_SQL = `INSERT INTO ${CONVERSATIONS_TABLE_NAME} (creatorID, conversationName) VALUES (?)`;
const CREATE_CONTACT_INVITATION_SQL = `INSERT INTO ${CONTACTS_TABLE_NAME} (senderID, receiverID, status) VALUES (?)`;

const DELETE_MESSAGES_BY_CONVERSATION_ID_SQL = `DELETE FROM ${MESSAGES_TABLE_NAME} WHERE conversationID = (?)`;
const DELETE_CONVERSATION_BY_ID_SQL = `DELETE FROM ${CONVERSATIONS_TABLE_NAME} WHERE id = (?)`;

const getConnection = () => new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
        if (err) {
            return reject(err);
        }

        query(connection, USE_DATABASE_SQL);

        return resolve(connection);
    })
});

const query = (connection, sqlTemplateQuery, insertValues = []) => new Promise((resolve, reject) => {
    connection.query(sqlTemplateQuery, insertValues, (error, results) => {
        if (error) {
            return reject(error);
        }

        return resolve(results);
    });
});

const createDatabase = async () => {
    let connection;
    try {
        connection = await getConnection();
        console.log('get connection');

        await query(connection, CREATE_DATABASE_SQL);
        console.log(`created database: ${DATABASE_NAME}`);

        await query(connection, USE_DATABASE_SQL);

        await query(connection, CREATE_USERS_TABLE_SQL);
        console.log(`created table: ${USERS_TABLE_NAME}`);

        await query(connection, CREATE_CONVERSATIONS_TABLE_SQL);
        console.log(`created table: ${CONVERSATIONS_TABLE_NAME}`);

        await query(connection, CREATE_MESSAGES_TABLE_SQL);
        console.log(`created table: ${MESSAGES_TABLE_NAME}`);

        await query(connection, CREATE_CONTACTS_TABLE_SQL);
        console.log(`created table: ${CONTACTS_TABLE_NAME}`);

        await query(connection, CREATE_INVITATIONS_TABLE_SQL);
        console.log(`created table: ${INVITATIONS_TABLE_NAME}`);

    } catch (error) {
        console.error(error);
    } finally {
        connection.release();
        console.log('connection released');
    }
};

createDatabase();

const findUserByEmail = async (email) => {
    let connection;
    try {
        connection = await getConnection();

        const insertValues = [
            [email]
        ];

        const results = await query(connection, GET_USER_SQL, insertValues);
        if (results.length == 0) throw new Error("Username/Email doesn\'t exists.");

        const user = results[0];
        return user;
    } catch (error) {
        console.log(error);
        return null;
    } finally {
        connection.release();
        console.log('connection released');
    }
};

const findUserByID = async (id) => {
    let connection;
    try {
        connection = await getConnection();

        const insertValues = [
            [id]
        ];

        const results = await query(connection, GET_USER_BY_ID_SQL, insertValues);
        if (results.length == 0) throw new Error("User doesn\'t exists.");

        const user = results[0];
        return user;
    } catch (error) {
        console.error(error);
        return null;
    } finally {
        connection.release();
        console.log('connection released');
    }
};

const getUsersBySearchQuery = async (searchQuery, user) => {
    let connection;
    try {
        connection = await getConnection();

        const insertValues = [
            [user.id],
            [user.id],
            [searchQuery],
            [searchQuery],
            [user.id]
        ];

        const results = await query(connection, GET_USERS_BY_SEARCH_SQL, insertValues);
        const users = results.map(row => {
            delete row.password
            return row;
        });
        return users;
    } catch (error) {
        console.error(error);
        return null;
    } finally {
        connection.release();
    }
};

const findMessagesByConversationID = async (connection, id) => {
    try {
        const insertValues = [
            [id]
        ];

        const results = await query(connection, GET_MESSAGES_BY_CONVERSATION_ID_SQL, insertValues);
        const messages = results;
        return messages;
    } catch (error) {
        console.error(error);
        return null;
    } finally {
        connection.release();
    }
};

function findConversationsByCreatorID(userID) {
    return new Promise((resolve, reject) => {
        pool.getConnection(function (err, connection) {
            if (err) reject(err);

            connection.query(USE_DATABASE_SQL, function (err) {
                if (err) reject(err);

                const values = [
                    [userID]
                ];
                connection.query(GET_CONVERSATIONS_BY_CREATOR_ID_SQL, values, async function (err, result, fields) {
                    if (err) reject(err);

                    const conversations = result.map(r => {
                        return {
                            ...r
                        }
                    });

                    await Promise.all(conversations.map(async conversation => {
                        await findMessagesByConversationID(connection, conversation.id)
                            .then(messages => {
                                conversation.messages = [...messages];
                                return conversation;
                            })
                            .catch(error => {
                                console.log(`error = ${error}`);
                                return conversation;
                            });
                    }));

                    connection.release();
                    return resolve(conversations);
                });
            });
        });
    });
}

function createUser(username, password, email, bio) {
    return new Promise((resolve, reject) => {
        pool.getConnection(function (err, connection) {
            if (err) reject(err);

            connection.query(USE_DATABASE_SQL, function (err) {
                if (err) reject(err);

                const insertValues = [
                    [username, password, email, bio]
                ];
                connection.query(CREATE_USER_SQL, insertValues, function (err, result, fields) {
                    if (err) {
                        if (err.signupcode === 'ER_DUP_ENTRY') reject('Username/Email already exists.');
                        else reject(err);
                    }

                    const selectValues = [email];
                    connection.query(GET_USER_SQL, selectValues, function (err, result, fields) {
                        if (err) reject(err);

                        connection.release();

                        const user = result[0];
                        resolve(user);
                    });
                });
            });
        });
    });
}

function createNewMessage({
    conversationID,
    authorID,
    messageText
}) {
    return new Promise((resolve, reject) => {
        pool.getConnection(function (err, connection) {
            if (err) return reject(err);

            connection.query(USE_DATABASE_SQL, err => {
                if (err)
                    return reject(err);

                const insertValues = [
                    [conversationID, authorID, messageText]
                ];

                connection.query(CREATE_MESSAGE_SQL, insertValues, (err, result, fields) => {
                    if (err) {
                        return reject(err);
                    }

                    const selectValues = [result.insertId];
                    connection.query(GET_MESSAGE_BY_ID_SQL, selectValues, function (err, result, fields) {
                        if (err) reject(err);
                        connection.release();
                        const message = result[0];
                        resolve(message);
                    });
                });
            });
        });
    });
}

function createNewConversation({
    creatorID,
    conversationName
}) {
    return new Promise((resolve, reject) => {
        pool.getConnection(function (err, connection) {
            if (err) return reject(err);

            connection.query(USE_DATABASE_SQL, err => {
                if (err)
                    return reject(err);

                const insertValues = [
                    [creatorID, conversationName]
                ];

                connection.query(CREATE_CONVERSATION_SQL, insertValues, (err, result, fields) => {
                    if (err) {
                        return reject(err);
                    }

                    const selectValues = [result.insertId];
                    connection.query(GET_CONVERSATION_BY_ID_SQL, selectValues, function (err, result, fields) {
                        if (err) reject(err);
                        connection.release();
                        const conversation = result[0];
                        resolve(conversation);
                    });
                });
            });
        });
    });
}

function deleteConversation(conversation) {
    return new Promise((resolve, reject) => {
        if (!conversation.id) {
            reject('Invalid conversation');
        }

        try {
            pool.getConnection(async function (err, connection) {
                if (err) return reject(err);

                await new Promise((resolve, reject) => {
                    connection.query(USE_DATABASE_SQL, async err => {
                        if (err) {
                            return reject(err);
                        }

                        return resolve();
                    });
                });

                await new Promise((resolve, reject) => {
                    const insertValues = [
                        [conversation.id]
                    ];
                    connection.query(DELETE_MESSAGES_BY_CONVERSATION_ID_SQL, insertValues, (err, result, fields) => {
                        if (err) {
                            return reject(err);
                        }

                        return resolve();
                    });
                });

                await new Promise((resolve, reject) => {
                    const insertValues = [
                        [conversation.id]
                    ];
                    connection.query(DELETE_CONVERSATION_BY_ID_SQL, insertValues, (err, result, fields) => {
                        if (err) {
                            return reject(err);
                        }

                        return resolve();
                    });
                });
            });

        } catch (error) {
            return reject(error);
        }

        return resolve(conversation);
    });
}

function getContacts(user) {
    return new Promise(async (resolve, reject) => {
        if (!user.id) {
            reject('Invalid user');
        }

        let contacts = [];
        let sentInvitations = [];
        let receivedInvitations = [];

        let connection;
        try {
            await new Promise((resolve, reject) => {
                pool.getConnection((err, con) => {
                    if (err) {
                        return reject(err);
                    }

                    connection = con;
                    return resolve();
                })
            });

            await new Promise((resolve, reject) => {
                connection.query(USE_DATABASE_SQL, async err => {
                    if (err) {
                        return reject(err);
                    }

                    return resolve();
                });
            });

            await new Promise((resolve, reject) => {
                const insertValues = [
                    [user.id],
                    [user.id]
                ];
                connection.query(GET_CONTACTS_SQL, insertValues, (err, results, fields) => {
                    if (err) {
                        return reject(err);
                    }

                    contacts = [...results];

                    return resolve();
                });
            });

            await new Promise((resolve, reject) => {
                const insertValues = [
                    [user.id]
                ];
                connection.query(GET_SENT_INVITATIONS_SQL, insertValues, (err, result, fields) => {
                    if (err) {
                        return reject(err);
                    }

                    sentInvitations = [...result];

                    return resolve();
                });
            });

            await new Promise((resolve, reject) => {
                const insertValues = [
                    [user.id]
                ];
                connection.query(GET_RECEIVED_INVITATIONS_SQL, insertValues, (err, result, fields) => {
                    if (err) {
                        return reject(err);
                    }

                    receivedInvitations = [...result];

                    return resolve();
                });
            });

            return resolve({
                contacts,
                sentInvitations,
                receivedInvitations
            });
        } catch (error) {
            return reject(error);
        } finally {
            connection.release();
        }
    });
}

const createInvitation = (senderUser, receiverUser) => new Promise(async (resolve, reject) => {
    if (!senderUser) {
        return reject('Missing Sender User');
    }

    if (!receiverUser) {
        return reject('Missing Receiver User');
    }

    let connection;
    try {
        await new Promise((resolve, reject) => {
            pool.getConnection((err, con) => {
                if (err) {
                    return reject(err);
                }

                connection = con;
                return resolve();
            })
        });

        await new Promise((resolve, reject) => {
            connection.query(USE_DATABASE_SQL, async err => {
                if (err) {
                    return reject(err);
                }

                return resolve();
            });
        });

        await new Promise((resolve, reject) => {
            const insertValues = [
                [senderUser.id, receiverUser.id, 1]
            ];
            connection.query(CREATE_CONTACT_INVITATION_SQL, insertValues, (error, result) => {
                if (error) {
                    return reject(error);
                }

                return resolve();
            });
        })

        return resolve();
    } catch (error) {
        return reject(error);
    } finally {
        connection.release();
    }
});

module.exports = {
    findUserByEmail,
    findUserByID,
    findConversationsByCreatorID,
    createUser,
    createNewMessage,
    createNewConversation,
    createInvitation,
    deleteConversation,
    getUsersBySearchQuery,
    getContacts
};