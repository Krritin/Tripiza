function DayTimeline({ day, startDate, onAddActivity, onDeleteActivity }) {
    const getDateForDay = () => {
      const date = new Date(startDate);
      date.setDate(date.getDate() + day.day - 1);
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      });
    };
  
    const sortedActivities = [...day.activities].sort((a, b) => {
      return a.time.localeCompare(b.time);
    });
  
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white">
          <h2 className="text-xl font-bold">Day {day.day}</h2>
          <p className="text-sm opacity-90">{getDateForDay()}</p>
        </div>
  
        <div className="p-6">
          {sortedActivities.length === 0 ? (
            <div className="text-center py-8">
              <span className="text-4xl">📅</span>
              <p className="text-gray-500 mt-2">No activities planned for this day</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedActivities.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  <div className="flex-shrink-0 w-20 text-center">
                    <div className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-medium">
                      {activity.time}
                    </div>
                  </div>
  
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 text-lg">
                      {activity.title}
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">
                      📍 {activity.location}
                    </p>
                    {activity.notes && (
                      <p className="text-gray-500 text-sm mt-2 italic">
                        💡 {activity.notes}
                      </p>
                    )}
                  </div>
  
                  <button
                    onClick={() => onDeleteActivity(index)}
                    className="flex-shrink-0 text-red-500 hover:text-red-700 transition"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          )}
  
          <button
            onClick={onAddActivity}
            className="w-full mt-4 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center space-x-2"
          >
            <span className="text-xl">+</span>
            <span>Add Activity</span>
          </button>
        </div>
      </div>
    );
  }
  
  export default DayTimeline;