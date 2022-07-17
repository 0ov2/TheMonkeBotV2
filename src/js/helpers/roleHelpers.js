


const getSpecificRoleByName = (client, roleName) => {
    const guildID = client.guilds.cache.firstKey()
    const role = client.guilds.cache.get(guildID).roles.cache.find(role => role.name === roleName)

    if (role){
        return role
    } else {
        return console.log(`role ${roleName} not found`)
    }
}

module.exports = { getSpecificRoleByName }