export default function DashboardHome() {
  return (
    <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
      <div className="min-w-0 p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
        <h4 className="mb-4 font-semibold text-gray-800 dark:text-gray-300 font-oxanium">
          Bienvenue au Tableau de Bord
        </h4>
        <p className="text-gray-600 dark:text-gray-400 font-kanit">
          Personnalisez votre tableau de bord en ajoutant plus de widgets ici.
        </p>
      </div>
    </div>
  );
}
