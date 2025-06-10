
import { logoutRequest } from "@/service/auth";
import { useRouter } from 'next/navigation';


export async function closeSecion({
    logout,
    router,
}: {
    logout: () => void;
    router: ReturnType<typeof useRouter>;
}) {
    try {
        await logoutRequest();
        logout();
        router.replace("/login");
    } catch (error) {
        console.error("Error en logout:", error);
        logout();
        router.replace("/login");
    }
}