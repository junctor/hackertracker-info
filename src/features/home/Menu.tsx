import { ArrowTopRightOnSquareIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router";

import Image from "@/components/Image";
import {
  HOME_HERO_LOGO_WRAP_CLASS_NAME,
  HOME_HERO_STACK_CLASS_NAME,
  HOME_SECTION_CLASS_NAME,
  useHomeModel,
} from "@/features/home/homeModel";
import { ConferenceManifest } from "@/lib/conferences";
import { useSiteMenu } from "@/lib/hooks/useSiteMenu";

type Props = {
  conference: ConferenceManifest;
};

const menuCardClassName = "ui-card ui-card-interactive ui-focus-ring ui-home-menu-card";

const menuCardIconClassName = "ui-home-menu-card-icon";

const menuCardActionClassName = "ui-home-menu-card-action";

export default function Menu({ conference }: Props) {
  const home = useHomeModel(conference);
  const navMenu = useSiteMenu(conference);

  return (
    <section className={HOME_SECTION_CLASS_NAME}>
      <div className={HOME_HERO_STACK_CLASS_NAME}>
        <h1 className="ui-visually-hidden">{conference.name}</h1>
        <div className={HOME_HERO_LOGO_WRAP_CLASS_NAME}>
          <Image
            src={home.logoSrc}
            alt={home.logoAlt}
            fillContainer
            loading="eager"
            sizes="(min-width: 1024px) 672px, (min-width: 640px) 66vw, 92vw"
            className="ui-image-contain"
          />
        </div>
      </div>

      <nav aria-label={`${conference.name} sections`} className="ui-home-menu-nav">
        <ul className="ui-home-menu-grid">
          {navMenu.map((item) => {
            const Icon = item.icon;
            const isExternal = item.href.startsWith("http");

            const content = (
              <>
                <div aria-hidden="true" className="ui-home-menu-card-aura" />

                <div className="ui-home-menu-card-content">
                  <div className="ui-home-menu-card-top">
                    <span className={menuCardIconClassName}>
                      <Icon className="ui-icon-sm" aria-hidden="true" />
                    </span>

                    <span className={menuCardActionClassName}>
                      {isExternal ? (
                        <ArrowTopRightOnSquareIcon className="ui-icon-xs" aria-hidden="true" />
                      ) : (
                        <ChevronRightIcon className="ui-icon-xs" aria-hidden="true" />
                      )}
                    </span>
                  </div>

                  <div className="ui-home-menu-card-copy">
                    <div className="ui-home-menu-card-title-row">
                      <h2 className="ui-card-title ui-home-menu-card-title">
                        {item.title}
                        {isExternal ? (
                          <span className="ui-visually-hidden">, opens in a new tab</span>
                        ) : null}
                      </h2>
                    </div>

                    {item.description ? (
                      <p className="ui-card-meta ui-home-menu-card-description">
                        {item.description}
                      </p>
                    ) : null}
                  </div>
                </div>
              </>
            );

            return (
              <li key={item.href}>
                {isExternal ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={menuCardClassName}
                  >
                    {content}
                  </a>
                ) : (
                  <Link to={item.href} className={menuCardClassName}>
                    {content}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </section>
  );
}
