import { useRouter } from 'expo-router'
import React from 'react'
import { Text, View } from 'react-native'
import { logout } from '@/api/auth_routes'

const index = () => {
    const router = useRouter()

    const handleLogout = async () => {
        await logout()
        router.replace('/modal')
        
    }
  return (
    <View>
        <Text>This is Worker Home page</Text>
        <Text onPress={handleLogout} style={{paddingTop: 50}}>Logout</Text>
    </View>
  )
}

export default index