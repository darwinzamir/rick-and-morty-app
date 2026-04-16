export default function Filters({ filters, onChange }) {
  const update = (key, val) => onChange({ ...filters, [key]: val })

  return (
    <div className="flex flex-wrap gap-3 mb-6 p-4 bg-gray-800 rounded-xl border border-gray-700">
      <input
        type="text"
        placeholder="Search by name..."
        value={filters.name}
        onChange={e => update('name', e.target.value)}
        className="flex-1 min-w-48 bg-gray-700 text-white rounded-lg px-3 py-2 text-sm border border-gray-600 focus:border-green-400 outline-none"
      />
      <select
        value={filters.status}
        onChange={e => update('status', e.target.value)}
        className="bg-gray-700 text-white rounded-lg px-3 py-2 text-sm border border-gray-600 focus:border-green-400 outline-none"
      >
        <option value="">All Status</option>
        <option value="Alive">Alive</option>
        <option value="Dead">Dead</option>
        <option value="unknown">Unknown</option>
      </select>
      <select
        value={filters.species}
        onChange={e => update('species', e.target.value)}
        className="bg-gray-700 text-white rounded-lg px-3 py-2 text-sm border border-gray-600 focus:border-green-400 outline-none"
      >
        <option value="">All Species</option>
        <option value="Human">Human</option>
        <option value="Alien">Alien</option>
        <option value="Robot">Robot</option>
        <option value="Mythological Creature">Mythological Creature</option>
      </select>
      <select
        value={filters.gender}
        onChange={e => update('gender', e.target.value)}
        className="bg-gray-700 text-white rounded-lg px-3 py-2 text-sm border border-gray-600 focus:border-green-400 outline-none"
      >
        <option value="">All Genders</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Genderless">Genderless</option>
        <option value="unknown">Unknown</option>
      </select>
      <select
        value={filters.sortBy}
        onChange={e => update('sortBy', e.target.value)}
        className="bg-gray-700 text-white rounded-lg px-3 py-2 text-sm border border-gray-600 focus:border-green-400 outline-none"
      >
        <option value="A-Z">Sort A→Z</option>
        <option value="Z-A">Sort Z→A</option>
      </select>
    </div>
  )
}