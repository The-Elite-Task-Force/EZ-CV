import type {
  Award,
  Certification,
  CustomSectionGroup,
  Interest,
  Language,
  Profile,
  Publication,
  Reference,
  SectionKey,
  SectionWithItem,
  URL,
} from "@reactive-resume/schema";
import type { Volunteer as VolunteerType } from "@reactive-resume/schema";
import { cn, isEmptyString, isUrl, linearTransform, sanitize } from "@reactive-resume/utils";
import get from "lodash.get";
import React, { Fragment } from "react";

import { BrandIcon } from "../components/brand-icon";
import { useArtboardStore } from "../store/artboard";
import type { TemplateProps } from "../types/template";

const canvasHeight = 679;

type RatingProps = { level: number };

const Rating = ({ level }: RatingProps) => (
  <div className="relative h-1 w-[128px]">
    <div className="absolute inset-0 h-1 w-[128px] rounded bg-primary/25" />
    <div
      className="absolute inset-0 h-1 rounded bg-primary"
      style={{ width: linearTransform(level, 0, 5, 0, 128) }}
    />
  </div>
);

type LinkProps = {
  url: URL;
  icon?: React.ReactNode;
  iconOnRight?: boolean;
  label?: string;
  className?: string;
};

const Link = ({ url, icon, iconOnRight, label, className }: LinkProps) => {
  if (!isUrl(url.href)) return null;

  return (
    <div className="flex items-center gap-x-1.5">
      {!iconOnRight && (icon ?? <i className="ph ph-bold ph-link text-primary" />)}
      <a
        href={url.href}
        target="_blank"
        rel="noreferrer noopener nofollow"
        className={cn("inline-block", className)}
      >
        {label ?? (url.label || url.href)}
      </a>
      {iconOnRight && (icon ?? <i className="ph ph-bold ph-link text-primary" />)}
    </div>
  );
};

type LinkedEntityProps = {
  name: string;
  url: URL;
  separateLinks: boolean;
  className?: string;
};

const LinkedEntity = ({ name, url, separateLinks, className }: LinkedEntityProps) => {
  return !separateLinks && isUrl(url.href) ? (
    <Link
      url={url}
      label={name}
      icon={<i className="ph ph-bold ph-globe text-primary" />}
      iconOnRight={true}
      className={className}
    />
  ) : (
    <div className={className}>{name}</div>
  );
};

type SectionProps<T> = {
  section: SectionWithItem<T> | CustomSectionGroup;
  children?: (item: T) => React.ReactNode;
  className?: string;
  urlKey?: keyof T;
  levelKey?: keyof T;
  summaryKey?: keyof T;
  keywordsKey?: keyof T;
};

const Section = <T,>({
  section,
  children,
  className,
  urlKey,
  levelKey,
  summaryKey,
  keywordsKey,
}: SectionProps<T>) => {
  if (section.items.length === 0) return null;

  return (
    <section id={section.id}>
      <div
        className="grid gap-6"
        style={{ gridTemplateColumns: `repeat(${section.columns}, 1fr)` }}
      >
        {section.items.map((item) => {
          const url = (urlKey && get(item, urlKey)) as URL | undefined;
          const level = (levelKey && get(item, levelKey, 0)) as number | undefined;
          const summary = (summaryKey && get(item, summaryKey, "")) as string | undefined;
          const keywords = (keywordsKey && get(item, keywordsKey, [])) as string[] | undefined;

          return (
            <div key={item.id} className={cn("space-y-2", className)}>
              <div>{children?.(item as T)}</div>

              {summary !== undefined && !isEmptyString(summary) && (
                <div
                  dangerouslySetInnerHTML={{ __html: sanitize(summary) }}
                  className="wysiwyg text-sm leading-relaxed"
                />
              )}

              {level !== undefined && level > 0 && <Rating level={level} />}

              {keywords !== undefined && keywords.length > 0 && (
                <p className="text-sm italic">{keywords.join(", ")}</p>
              )}

              {url !== undefined && section.separateLinks && (
                <div className="mt-1">
                  <Link url={url} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

const Profiles = () => {
  const section = useArtboardStore((state) => state.resume.sections.profiles);

  return (
    <Section<Profile> section={section}>
      {(item) => (
        <div>
          {isUrl(item.url.href) ? (
            <Link url={item.url} label={item.username} icon={<BrandIcon slug={item.icon} />} />
          ) : (
            <p>{item.username}</p>
          )}
          {!item.icon && <p className="text-sm text-gray-200">{item.network}</p>}
        </div>
      )}
    </Section>
  );
};

const Summary = () => {
  const section = useArtboardStore((state) => state.resume.sections.summary);
  const content = section.items.map((item) => item.content).join("\n");
  if (isEmptyString(content)) return null;

  return (
    <section
      id={section.id}
      className="text-xs text-white"
      style={{ maxHeight: "250px", overflow: "hidden" }}
    >
      <div dangerouslySetInnerHTML={{ __html: sanitize(content) }} className="text-xs" />
    </section>
  );
};

const Experience = () => {
  const section = useArtboardStore((state) => state.resume.sections.experience);

  return (
    <div className="truncate">
      {section.items.map((item) => (
        <div className="text-xs text-black">
          {item.company}, {item.position} {item.date}
        </div>
      ))}
    </div>
  );
};

const Education = () => {
  const section = useArtboardStore((state) => state.resume.sections.education);

  return (
    <div className="truncate">
      {section.items.map((item) => (
        <div className="text-xs text-black">
          {item.studyType}, {item.institution} {item.date}
        </div>
      ))}
    </div>
  );
};

const Awards = () => {
  const section = useArtboardStore((state) => state.resume.sections.awards);

  return (
    <Section<Award> section={section} urlKey="url" summaryKey="summary">
      {(item) => (
        <div className="space-y-0.5">
          <div className="text-lg font-semibold">{item.title}</div>
          <LinkedEntity name={item.awarder} url={item.url} separateLinks={section.separateLinks} />
          <div className="text-sm font-semibold">{item.date}</div>
        </div>
      )}
    </Section>
  );
};

const Certifications = () => {
  const section = useArtboardStore((state) => state.resume.sections.certifications);

  return (
    <Section<Certification> section={section} urlKey="url" summaryKey="summary">
      {(item) => (
        <div className="space-y-0.5">
          <div className="text-lg font-semibold">{item.name}</div>
          <LinkedEntity name={item.issuer} url={item.url} separateLinks={section.separateLinks} />
          <div className="text-sm font-semibold">{item.date}</div>
        </div>
      )}
    </Section>
  );
};

const Skills = () => {
  const section = useArtboardStore((state) => state.resume.sections.skills);

  return (
    <ul className="" style={{ maxHeight: "150px", overflow: "hidden" }}>
      {section.items.map((item) => (
        <li key={item.id} className="text-[10px] text-white">
          • {item.name}
        </li>
      ))}
    </ul>
  );
};

const Interests = () => {
  const section = useArtboardStore((state) => state.resume.sections.interests);

  return (
    <Section<Interest> section={section} keywordsKey="keywords">
      {(item) => <div className="text-lg font-semibold">{item.name}</div>}
    </Section>
  );
};

const Publications = () => {
  const section = useArtboardStore((state) => state.resume.sections.publications);

  return (
    <Section<Publication> section={section} urlKey="url" summaryKey="summary">
      {(item) => (
        <div className="space-y-0.5">
          <LinkedEntity
            name={item.name}
            url={item.url}
            separateLinks={section.separateLinks}
            className="text-lg font-semibold"
          />
          <div className="text-sm text-gray-700">{item.publisher}</div>
          <div className="text-sm font-semibold">{item.date}</div>
        </div>
      )}
    </Section>
  );
};

const Volunteer = () => {
  const section = useArtboardStore((state) => state.resume.sections.volunteer);

  return (
    <Section<VolunteerType> section={section} urlKey="url" summaryKey="summary">
      {(item) => (
        <div className="space-y-0.5">
          <LinkedEntity
            name={item.organization}
            url={item.url}
            separateLinks={section.separateLinks}
            className="text-lg font-semibold"
          />
          <div className="italic">{item.position}</div>
          <div className="text-sm text-gray-700">{item.location}</div>
          <div className="text-sm font-semibold">{item.date}</div>
        </div>
      )}
    </Section>
  );
};

const Languages = () => {
  const section = useArtboardStore((state) => state.resume.sections.languages);

  return (
    <Section<Language> section={section} levelKey="level">
      {(item) => (
        <div className="space-y-0.5">
          <div className="text-lg font-semibold">{item.name}</div>
          <div className="text-sm text-gray-700">{item.description}</div>
        </div>
      )}
    </Section>
  );
};

const Projects = () => {
  const section = useArtboardStore((state) => state.resume.sections.projects);

  return (
    <ul className="truncate">
      {section.items.map((item) => (
        <li key={item.id} className="text-xs text-black">
          • {item.name} {item.date}: {item.description}
        </li>
      ))}
    </ul>
  );
};

const References = () => {
  const section = useArtboardStore((state) => state.resume.sections.references);

  return (
    <Section<Reference> section={section} urlKey="url" summaryKey="summary">
      {(item) => (
        <div className="space-y-0.5">
          <LinkedEntity
            name={item.name}
            url={item.url}
            separateLinks={section.separateLinks}
            className="text-lg font-semibold"
          />
          <div className="text-sm text-gray-700">{item.description}</div>
        </div>
      )}
    </Section>
  );
};

const mapSectionToComponent = (section: SectionKey) => {
  switch (section) {
    case "profiles": {
      return <Profiles />;
    }
    case "summary": {
      return <Summary />;
    }
    case "experience": {
      return <Experience />;
    }
    case "education": {
      return <Education />;
    }
    case "awards": {
      return <Awards />;
    }
    case "certifications": {
      return <Certifications />;
    }
    case "skills": {
      return <Skills />;
    }
    case "interests": {
      return <Interests />;
    }
    case "publications": {
      return <Publications />;
    }
    case "volunteer": {
      return <Volunteer />;
    }
    case "languages": {
      return <Languages />;
    }
    case "projects": {
      return <Projects />;
    }
    case "references": {
      return <References />;
    }
    default: {
      return null;
    }
  }
};

export const Torterra = ({ columns, isFirstPage = false }: TemplateProps) => {
  const [main, sidebar] = columns;
  const basics = useArtboardStore((state) => state.resume.basics);

  return (
    <div className="size-full">
      {isFirstPage && (
        <div className="size-full">
          <div className="grid grid-cols-4">
            {/* Area 1: Far Left – Contact Information */}
            <aside className="col-span-1 flex flex-col bg-[#67817f] text-white">
              <div style={{ height: `${canvasHeight * 0.71}px` }} className="w-full">
                <div className="absolute left-8 top-8 z-10 text-xl text-white">CV</div>
                <img
                  alt="Employee"
                  src={basics.picture.url}
                  className="size-full object-cover shadow-lg"
                />
              </div>
              <div
                style={{ height: `${canvasHeight * 0.219}px` }}
                className="p-8 text-left text-xs"
              >
                {basics.headline && (
                  <div className="mb-4 font-medium">
                    <span>{basics.headline}</span>
                  </div>
                )}
                {basics.email && (
                  <div className="">
                    <span>{basics.email}</span>
                  </div>
                )}
                {basics.phone && (
                  <div className="">
                    <span>{basics.phone}</span>
                  </div>
                )}
              </div>
            </aside>

            {/* Area 2: Middle – Personal Details (Name, Skills, and Summary) */}
            <div
              className="col-span-1 bg-[#768e8c] px-8"
              style={{ maxHeight: `${canvasHeight}px`, overflow: "hidden" }}
            >
              <div className="h-[10%]"></div>
              <div className="mb-4">
                <h1 className="mt-12 text-4xl text-white">{basics.name}</h1>
              </div>

              <div className="mb-4 mt-10">
                <h3 className="font mt-2 text-xs text-white">AREAS OF EXPERTICE</h3>
              </div>

              <div className="mb-4">
                <Skills />
              </div>
              <div>
                <Summary />
              </div>
            </div>

            {/* Area 3: Right – Main Content (Work/Experience, Projects, Education) */}
            <main
              className="col-span-2 flex flex-col bg-white p-6"
              style={{ maxHeight: `${canvasHeight}px`, overflow: "hidden" }}
            >
              <div className="h-1/4"></div>

              <div className="h-1/4 overflow-hidden truncate p-4">
                <div className="mb-2 pb-1 text-xs font-bold uppercase text-black">Experience</div>
                <Experience />
              </div>

              <div className="h-[14%] overflow-hidden truncate p-4">
                <div className="mb-2 pb-1 text-xs font-bold uppercase text-black">Education</div>
                <Education />
              </div>

              <div className="h-2/5 overflow-hidden truncate p-4">
                <div className="mb-2 pb-1 text-xs font-bold uppercase text-black">
                  Selected Projects
                </div>
                <Projects />
              </div>
            </main>
          </div>
        </div>
      )}

      {!isFirstPage && (
        <div className="grid grid-cols-3">
          <aside className="col-span-1 space-y-6 bg-[#CFD8DC] p-6">
            {sidebar
              .filter((section) => section !== "summary")
              .map((section) => (
                <Fragment key={section}>{mapSectionToComponent(section)}</Fragment>
              ))}
          </aside>

          <main className="col-span-2 space-y-6 bg-white p-6">
            {main.map((section) => (
              <Fragment key={section}>{mapSectionToComponent(section)}</Fragment>
            ))}
          </main>
        </div>
      )}
    </div>
  );
};
