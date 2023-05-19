import connection from "../util/database"

export const transaction = () => {
    return connection.transaction();
}