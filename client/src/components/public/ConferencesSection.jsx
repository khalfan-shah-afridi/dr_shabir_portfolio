import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  CalendarDays,
  MapPin,
  Globe2,
  ExternalLink,
  Award,
} from "lucide-react";

import api from "../../services/api";

function formatDate(date) {
  if (!date) {
    return "";
  }

  return new Date(date).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    }
  );
}

function ConferencesSection() {
  const [conferences, setConferences] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const loadConferences = async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await api.get(
            "/conferences/public"
          );

        setConferences(
          response.data?.data || []
        );
      } catch (err) {
        console.error(
          "Public conferences error:",
          err
        );

        setError(
          "Unable to load conferences right now."
        );
      } finally {
        setLoading(false);
      }
    };

    loadConferences();
  }, []);

  if (loading) {
    return (
      <section className="public-section">
        <div className="public-section-heading">
          <span>ACADEMIC PARTICIPATION</span>
          <h2>Conferences</h2>
        </div>

        <div className="public-loading">
          Loading conferences...
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="public-section">
        <div className="public-section-heading">
          <span>ACADEMIC PARTICIPATION</span>
          <h2>Conferences</h2>
        </div>

        <div className="public-empty">
          {error}
        </div>
      </section>
    );
  }

  if (conferences.length === 0) {
    return null;
  }

  return (
    <section className="public-section">
      <div className="public-section-heading">
        <span>
          ACADEMIC PARTICIPATION
        </span>

        <h2>
          Conferences & Events
        </h2>

        <p>
          Selected conferences, research
          presentations and academic
          participation.
        </p>
      </div>

      <div className="conferences-grid">
        {conferences.map(
          (conference) => (
            <motion.article
              key={conference._id}
              className="conference-public-card"
              initial={{
                opacity: 0,
                y: 20,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
                amount: 0.2,
              }}
              transition={{
                duration: 0.45,
              }}
              whileHover={{
                y: -6,
              }}
            >
              <div className="conference-card-top">

                <span className="conference-type">
                  <Globe2 size={13} />

                  {conference.type}
                </span>

                {conference.role && (
                  <span className="conference-role">
                    {conference.role}
                  </span>
                )}

              </div>

              <h3>
                {conference.title}
              </h3>

              <p className="conference-organizer">
                {conference.organizer}
              </p>

              <div className="conference-details">

                {conference.location && (
                  <div>
                    <MapPin size={16} />

                    <span>
                      {conference.location}
                      {conference.country
                        ? `, ${conference.country}`
                        : ""}
                    </span>
                  </div>
                )}

                {conference.startDate && (
                  <div>
                    <CalendarDays size={16} />

                    <span>
                      {formatDate(
                        conference.startDate
                      )}

                      {conference.endDate
                        ? ` — ${formatDate(
                            conference.endDate
                          )}`
                        : ""}
                    </span>
                  </div>
                )}

              </div>

              {conference.paperTitle && (
                <div className="conference-paper">
                  <Award size={15} />

                  <span>
                    {conference.paperTitle}
                  </span>
                </div>
              )}

              {conference.description && (
                <p className="conference-description">
                  {conference.description}
                </p>
              )}

              <div className="conference-links">

                {conference.websiteUrl && (
                  <a
                    href={
                      conference.websiteUrl
                    }
                    target="_blank"
                    rel="noreferrer"
                  >
                    <ExternalLink
                      size={14}
                    />
                    Conference Website
                  </a>
                )}

              </div>

            </motion.article>
          )
        )}
      </div>
    </section>
  );
}

export default ConferencesSection;