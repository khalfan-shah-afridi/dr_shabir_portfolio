import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  Mail,
  Phone,
  GraduationCap,
  Building2,
  UserRound,
} from "lucide-react";

import api from "../../services/api";

function ReferencesSection() {
  const [references, setReferences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadReferences = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          "/references/public"
        );

        setReferences(
          response.data?.data || []
        );
      } catch (err) {
        console.error(
          "Public references error:",
          err
        );

        setError(
          "Unable to load references right now."
        );
      } finally {
        setLoading(false);
      }
    };

    loadReferences();
  }, []);

  if (loading) {
    return (
      <section className="public-section">
        <div className="public-section-heading">
          <span>ACADEMIC NETWORK</span>
          <h2>References</h2>
        </div>

        <div className="public-loading">
          Loading references...
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="public-section">
        <div className="public-section-heading">
          <span>ACADEMIC NETWORK</span>
          <h2>References</h2>
        </div>

        <div className="public-empty">
          {error}
        </div>
      </section>
    );
  }

  if (references.length === 0) {
    return null;
  }

  return (
    <section className="public-section">
      <div className="public-section-heading">
        <span>ACADEMIC NETWORK</span>

        <h2>
          Professional References
        </h2>

        <p>
          Academic and professional
          references supporting research,
          teaching and professional work.
        </p>
      </div>

      <div className="references-grid">
        {references.map((reference) => (
          <motion.article
            key={reference._id}
            className="reference-public-card"
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
            <div className="reference-card-top">
              <div className="reference-avatar">
                {reference.name
                  ?.charAt(0)
                  ?.toUpperCase() || "R"}
              </div>

              <div>
                <h3>
                  {reference.name}
                </h3>

                <span>
                  {reference.designation}
                </span>
              </div>
            </div>

            <div className="reference-info">

              <div>
                <Building2 size={16} />

                <span>
                  {reference.institution}
                </span>
              </div>

              {reference.department && (
                <div>
                  <GraduationCap size={16} />

                  <span>
                    {reference.department}
                  </span>
                </div>
              )}

              {reference.contactEmail && (
                <div>
                  <Mail size={16} />

                  <a
                    href={`mailto:${reference.contactEmail}`}
                  >
                    {reference.contactEmail}
                  </a>
                </div>
              )}

              {reference.phone && (
                <div>
                  <Phone size={16} />

                  <a
                    href={`tel:${reference.phone}`}
                  >
                    {reference.phone}
                  </a>
                </div>
              )}

            </div>

            {reference.relationship && (
              <div className="reference-tag">
                <UserRound size={13} />

                {reference.relationship}
              </div>
            )}

            {reference.message && (
              <p className="reference-message">
                {reference.message}
              </p>
            )}

            {reference.profileUrl && (
              <a
                href={reference.profileUrl}
                target="_blank"
                rel="noreferrer"
                className="reference-profile-link"
              >
                View Profile
              </a>
            )}
          </motion.article>
        ))}
      </div>
    </section>
  );
}

export default ReferencesSection;