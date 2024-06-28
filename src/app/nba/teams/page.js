"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function NbaTeams() {
  const [teams, setTeams] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/login");
      }
    });

    async function fetchNbaTeams() {
      try {
        const res = await fetch("http://localhost:3000/nba/teams");
        if (!res.ok) {
          throw new Error(`HTTP error: ${res.status}`);
        }
        const data = await res.json();
        setTeams(data.response);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    }

    fetchNbaTeams();
  }, [router]);

  const handleOpenDialog = () => {
    console.log("open dialog");
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const confirmSignOut = async () => {
    try {
      await signOut(auth);
      handleCloseDialog();
      router.push("/login");
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  if (isLoading) return <p>Chargement...</p>;
  if (!teams.length) return <p>Aucune équipe trouvée.</p>;

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-center my-10">Équipes NBA</h1>
        <AlertDialog isOpen={isDialogOpen} onDismiss={handleCloseDialog}>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" onClick={() => handleOpenDialog()}>
              Déconnexion
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Déconnexion</AlertDialogTitle>
              <AlertDialogDescription>
                Êtes vous sûr de vouloir vous déconnecter ?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel asChild>
                <Button variant="outlined" onClick={() => handleCloseDialog()}>Annuler</Button>
              </AlertDialogCancel>
              <AlertDialogAction asChild>
                <Button variant="destructive" onClick={() => confirmSignOut()}>
                  Se Déconnecter
                </Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
          {teams.map(
            (team) =>
              team.nbaFranchise && (
                <div key={team.id} className="flex flex-col items-center">
                  <div className="bg-white rounded-lg shadow-md p-4 h-36 w-36 flex items-center justify-center">
                    <img
                      src={team.logo}
                      alt={`Logo de ${team.name}`}
                      className="max-h-24 max-w-24"
                    />
                  </div>
                  <p className="mt-2 text-center text-sm font-semibold">
                    {team.name}
                  </p>
                </div>
              )
          )}
        </div>
      </div>
    </div>
  );
}
