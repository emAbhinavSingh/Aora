import {FlatList, Text, View } from 'react-native'
import React, { useEffect, } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

import SearchInput from '../../components/SearchInput'
import EmptyState from '../../components/EmptyState'
import { searchPosts } from "../../lib/appwrite"
import useAppwrite from '../../lib/useAppwrite'
import VideoCard from '../../components/VideoCard'
import { useLocalSearchParams } from 'expo-router'

const Search = () => {
  const { query } = useLocalSearchParams()
  const {data : posts,refetch} = useAppwrite(() => searchPosts(query)) 
   
  useEffect(() => {
    refetch()
  },[query])
 
  return ( 
    <SafeAreaView className="bg-primary h-full">
      <FlatList 
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({item}) => (
          <VideoCard  video = {item} />
        )}
        ListHeaderComponent={()=>(
          <View className="my-6 px-4 ">
            <Text className="font-pmedium text-sm text-gray-100" >
              Search Results
            </Text>
            <Text className="font-psemibold text-white text-2xl">
              {query}
            </Text>

            <View className= "mt-6 mb-6">
              <SearchInput initalQuery = {query} />
            </View>
          </View>

        )}
        ListEmptyComponent={() => (
          <EmptyState  
            title="No Video Found"
            subtitle="No video found for this search query"
          />
        )}
      />
    </SafeAreaView>
  )
}

export default Search

//  Here in <Trending />  passing an post property that have an array and "??" if array does not exist  means if does't exist just make empty array so it does't break
// square bracket in file name means we can extract the value the search not only from the url but also from the screen