
const jwt_config = {
    secret: 'jwt_secret',
    types: {
        access:{
            name: 'access_token',
            expiresIn: '1800s'
        }
    }
}

export default jwt_config;