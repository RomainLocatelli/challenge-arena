import Image from 'next/image';

export default function SearchBarFilter() {
  return (
    <div>
      <button
        type="button"
        onClick={() => {
          setFilterModalArea(!filterModalArea);
        }}
        className="absolute bg-(--button-game-challenge) hover:bg-(--button-game-challenge-hover) rounded-full top-1/2 right-3 -translate-y-1/2 z-8 h-10 w-10 flex items-center justify-center shadow"
      >
        <Image
          src="/filter.png"
          width={100}
          height={100}
          alt="Search Icon"
          className="opacity-80"
        />
      </button>

      {/* Modal filter menu */}
      {filterModalArea ? (
        <div className="absolute flex items-center-safe justify-center bg-(--modal-filter-searchebar) p-5 rounded-4xl left-1/5 lg:left-1/3 lg:right-1/3">
          <p className="mr-3">Filter :</p>
          <div className="gap-2 m-2 flex flex-col ">
            <button
              type="button"
              onClick={() => {
                setOrderFilterSearchBar('ASC');
              }}
              className="bg-(--button-game-challenge) hover:bg-(--button-game-challenge-hover) rounded-4xl p-1"
            >
              Ascending ⬆️
            </button>
            <button
              type="button"
              onClick={() => {
                setOrderFilterSearchBar('DESC');
              }}
              className="bg-(--button-game-challenge) hover:bg-(--button-game-challenge-hover) rounded-4xl p-1"
            >
              Descending ⬇️
            </button>
          </div>
          <div className="gap-2 m-2 flex flex-col">
            <button
              type="button"
              onClick={() => {
                setFilterSelectorChoice('Popularity');
              }}
              className="bg-(--button-game-challenge) hover:bg-(--button-game-challenge-hover) rounded-4xl p-1"
            >
              Popularity
            </button>
            <button
              type="button"
              onClick={() => {
                setFilterSelectorChoice('Date added');
              }}
              className="bg-(--button-game-challenge) hover:bg-(--button-game-challenge-hover) rounded-4xl p-1"
            >
              Date added
            </button>
            <button
              type="button"
              onClick={() => {
                setFilterSelectorChoice('Alphabetical');
              }}
              className="bg-(--button-game-challenge) hover:bg-(--button-game-challenge-hover) rounded-4xl p-1"
            >
              Alphabetical
            </button>
          </div>
        </div>
      ) : (
        <p></p>
      )}
    </div>
  );
}
