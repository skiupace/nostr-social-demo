export function FeedHeader() {
  return (
    <>
      <div className="border-b border-slate-700 bg-black/80 backdrop-blur px-4 py-3">
        <h2 className="text-xl font-bold text-white">الرئيسية</h2>
      </div>

      <div className="border-b border-slate-700 p-4">
        <div className="flex gap-4 flex-row">
          <div className="w-12 h-12 rounded-full bg-linear-to-br from-blue-400 to-purple-500 shrink-0"></div>
          <div className="flex-1">
            <textarea
              placeholder="ما الذي يحدث!؟"
              className="w-full bg-transparent text-xl text-white placeholder-slate-500 outline-none resize-none"
              rows={3}
            />
            <div className="flex justify-end pt-4">
              <button className="px-8 py-2 bg-blue-500 text-white font-bold rounded-full hover:bg-blue-600 transition-colors duration-500">
                نشر
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
