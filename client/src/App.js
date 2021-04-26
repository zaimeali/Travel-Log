import * as React from "react";
import { useState, useEffect, Fragment } from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import { createLogEntry, listLogEntries } from "./API";
import { useForm } from "react-hook-form";

const App = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [logEntries, setLogEntries] = useState([]);
  const [showPopUp, setShowPopUp] = useState({});
  const [entryLocation, setEntryLocation] = useState(null);
  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "100vh",
    latitude: 37.6,
    longitude: -95.665,
    zoom: 4,
  });

  const { register, handleSubmit } = useForm();

  const getEntries = async () => {
    const logTravel = await listLogEntries();
    // console.log(logTravel);
    setLogEntries(logTravel);
  };

  useEffect(() => {
    // (async () => {
    //   const logTravel = await listLogEntries();
    //   console.log(logTravel);
    //   setLogEntries(logTravel);
    // })(); // immediately invoke function
    getEntries();
  }, []);

  const showAddMarkerPopup = (event) => {
    const [longitude, latitude] = event.lngLat;
    // console.log(event);
    setEntryLocation({
      longitude,
      latitude,
    });
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const { latitude, longitude } = entryLocation;
      data = { ...data, latitude, longitude };
      const created = await createLogEntry(data);
      console.log(created);
      setEntryLocation(null);
      getEntries();
    } catch (err) {
      console.error(err.message);
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <ReactMapGL
      {...viewport}
      mapStyle="mapbox://styles/zaimeali/cknxtucwl3hax18o44rs2osqk"
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
      onViewportChange={(nextViewport) => setViewport(nextViewport)}
      onDblClick={showAddMarkerPopup}
      doubleClickZoom={false}
    >
      {logEntries &&
        logEntries.map((logEntry, index) => (
          <Fragment key={index}>
            <Marker
              latitude={logEntry.latitude}
              longitude={logEntry.longitude}
              offsetLeft={-12}
              offsetTop={-24}
              onClick={() =>
                setShowPopUp({
                  // ...showPopUp,
                  [index]: true,
                })
              }
            >
              <div>
                <span
                  style={{
                    width: `24px`,
                    height: `24px`,
                    cursor: "pointer",
                  }}
                >
                  📍
                </span>
              </div>
            </Marker>
            {showPopUp[index] ? (
              <Popup
                latitude={logEntry.latitude}
                longitude={logEntry.longitude}
                closeButton={true}
                closeOnClick={true}
                dynamicPosition={true}
                // onClose={() => setShowPopUp(false)}
                onClose={() => setShowPopUp({})}
                anchor="top"
              >
                <div className="popup">
                  <h3>{logEntry.title}</h3>
                  <p>{logEntry.comments}</p>
                  <small>
                    Visited on:{" "}
                    {new Date(logEntry.visitDate).toLocaleDateString()}
                  </small>
                  {logEntry.image && (
                    <img
                      src={logEntry.image}
                      alt={logEntry.title}
                      style={{
                        width: "auto",
                        height: "200px",
                        textAlign: "center",
                        margin: "0 auto",
                        display: "block",
                        objectFit: "cover",
                      }}
                    />
                  )}
                </div>
              </Popup>
            ) : null}
          </Fragment>
        ))}
      {entryLocation && (
        <Fragment>
          <Marker
            latitude={entryLocation?.latitude}
            longitude={entryLocation?.longitude}
            offsetLeft={-12}
            offsetTop={-24}
          >
            <div>
              <span
                style={{
                  width: "28px",
                  height: "28px",
                  cursor: "pointer",
                }}
              >
                📌
              </span>
            </div>
          </Marker>
          <Popup
            latitude={entryLocation?.latitude}
            longitude={entryLocation?.longitude}
            closeButton={true}
            closeOnClick={true}
            dynamicPosition={true}
            // onClose={() => setShowPopUp(false)}
            onClose={() => setShowPopUp({})}
            anchor="top"
          >
            <div className="new-popup">
              <form onSubmit={handleSubmit(onSubmit)} className="entryForm">
                {error ? <h3 className="error">error</h3> : null}
                <label htmlFor="title">Title:</label>
                <input
                  type="text"
                  {...register("title", { required: true })}
                  name="title"
                  required
                />

                <label htmlFor="comments">Comments</label>
                <textarea
                  {...register("comments", { required: true })}
                  name="comments"
                  rows="3"
                  required
                ></textarea>

                <label htmlFor="description">Description</label>
                <textarea
                  {...register("description", { required: true })}
                  name="description"
                  rows="3"
                  required
                ></textarea>

                <label htmlFor="image">Image URL:</label>
                <input type="text" {...register("image")} name="image" />

                <label htmlFor="visitDate">Visit Date:</label>
                <input
                  type="date"
                  {...register("visitDate", { required: true })}
                  name="visitDate"
                  required
                />

                <button disabled={loading}>
                  {loading ? "Saving Entry" : "Create Log Entry"}
                </button>
              </form>
            </div>
          </Popup>
        </Fragment>
      )}
    </ReactMapGL>
  );
};

export default App;
