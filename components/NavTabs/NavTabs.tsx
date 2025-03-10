import {Tabs, Grid, Container, Title, Center, Paper, Skeleton} from "@mantine/core"
import {PostCard} from "../PostCard"
import PostData from "../PostCard/data.json"
import {ChatRoom} from "../ChatRoom"
import {useEffect, useState} from "react"
import {ManageProfile} from "../ManageProfile"
import Link from "next/link"
import useContract from "../../hooks/useContract"

const defaultActive = "first"

export function NavTabs({isOwner, profId, postCount, isPostCountFetched}) {
    const [active, setActive] = useState(defaultActive)
    const [isLoading, setIsLoading] = useState(true)
    const [posts, setPosts] = useState([])
    const {getLensPost} = useContract()
    useEffect(() => {
        if (isPostCountFetched) {
            initializePosts()
        }
    }, [isPostCountFetched])
    console.log(posts)

    const postCards = posts.map((post, index) => {
        return (
            <Grid.Col key={index} lg={4} md={6}>
                <Skeleton visible={isLoading} animate={true}>
                    <Container size={400} px="xs">
                        <PostCard
                            footer={`${Math.floor(Math.random() * 11)} people liked this post`}
                            image={post.image}
                            title={post.title}
                            description={post.description}
                        />
                    </Container>
                </Skeleton>
            </Grid.Col>
        )
    })

    const initializePosts = async () => {
        for (let i = 1; i <= postCount; i++) {
            const postFromLens = await getLensPost(profId, i)
            const postArray = postFromLens.split(",")
            const response = await fetch("https://" + postArray[2] + ".ipfs.w3s.link/json")
            const jsonObj = await response.json()
            const post = {
                id: jsonObj.metadata_id,
                title: jsonObj.content,
                description: jsonObj.description,
                image: "https://" + jsonObj.image + ".ipfs.w3s.link/image",
                authorAddress: jsonObj.address
            }
            setPosts((oldPosts) => [...oldPosts, post])
            setIsLoading(false)
        }
    }
    return (
        <Tabs
            variant="outline"
            defaultValue={defaultActive}
            onTabChange={(event) => {
                setActive(event)
            }}
        >
            <Tabs.List grow position="center" mb={75}>
                <Tabs.Tab value="first">Posts</Tabs.Tab>
                {isOwner && (
                    <>
                        <Tabs.Tab value="second">Your Chats</Tabs.Tab>
                        <Tabs.Tab value="third">Manage Profile</Tabs.Tab>
                    </>
                )}
            </Tabs.List>

            <Tabs.Panel value={"first"}>
                <Paper shadow="xl" radius="lg" p="md" pt={"lg"}>
                    <Grid>
                        {postCards}
                    </Grid>
                </Paper>
            </Tabs.Panel>
            <Tabs.Panel value={"second"}>
                <Title order={4} align={"center"} mb={"lg"} mt={0}>
                    Your Conversations
                </Title>
                <Paper shadow="xl" radius="lg" p="md">
                    {active === "second" ? <ChatRoom isActive={active === "second"}/> : null}
                    <Center>
                        <Title order={6} color={"dimmed"}>
                            Powered by XMTP
                        </Title>
                    </Center>
                </Paper>
            </Tabs.Panel>
            <Tabs.Panel value={"third"}>
                <Paper shadow="xl" radius="lg" p="md">
                    <ManageProfile/>
                </Paper>
            </Tabs.Panel>
        </Tabs>
    )
}
