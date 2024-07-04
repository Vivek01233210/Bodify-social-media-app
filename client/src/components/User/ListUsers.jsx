import { useMutation, useQuery } from "@tanstack/react-query"
import { blockUserAPI, listUsersAPI, unblockUserAPI } from "../../APIServices/userAPI"
import { FiUserCheck, FiUserX } from "react-icons/fi"

function ListUsers() {

    // fetch all users
    const { data, refetch } = useQuery({
        queryKey: ['users'],
        queryFn: listUsersAPI
    })

    // block user mutation
    const blockUserMutation = useMutation({
        mutationKey: ['block-user'],
        mutationFn: blockUserAPI
    })

    // unblock user mutation
    const unblockUserMutation = useMutation({
        mutationKey: ['unblock-user'],
        mutationFn: unblockUserAPI
    })

    const userHandler = (user) => {
        if (user.isBlocked) {
            unblockUserMutation.mutateAsync(user._id).then(() => refetch()).catch(err => console.log(err))
        } else {
            blockUserMutation
                .mutateAsync(user._id)
                .then(() => refetch())
                .catch(err => console.log(err))
        }
    }

    return (
        <div className="container mx-auto p-4 mt-16">
            <h1 className="text-3xl font-semibold text-center mb-8">List of Users</h1>
            <h2 className="text-xs text-center mb-1 text-red-500">Block/Unblock button has temporarily been disabled for safety reasons!</h2>
            <div className="space-y-3">
                {data?.users?.map(user => (
                    <div key={user._id} className="flex items-center justify-between bg-gray-200 rounded-md p-3">
                        <span className="text-lg font-semibold">{user.username}</span>
                        <button
                            // onClick={() => userHandler(user)}
                            className={`flex items-center gap-2 p-2 rounded text-white ${user.isBlocked ? "bg-red-500" : "bg-green-500"}`}>
                            {user.isBlocked ? (
                                <FiUserX />
                            ) : (
                                <FiUserCheck />
                            )}
                            {user.isBlocked ? "Unblock" : "Block"}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ListUsers