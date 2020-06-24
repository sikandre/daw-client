import React, { useState, useEffect, useCallback } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { genericRequest, templateRequest } from '../../../api/actions';

const Projects = (props) => {
  const history = useHistory();

  const [projects, setProjects] = useState(null);

  const getProjects = useCallback(
    async (url) => {
      url = `${history.location.pathname}${history.location.search}`;

      if (history.action === 'POP') {
        url = `${history.location.pathname}${history.location.search}`;

        if (history.location.search) {
          const template = await templateRequest();
          const uriTemplate = template.projectWithPageAndSizeUriTemplate;

          const pageable = history.location.search.match(/\d+/g);

          const temp =
            pageable.length === 1
              ? uriTemplate.split('&')[0].replace(/{(.*)}/, pageable[0])
              : uriTemplate
                  .replace(/\s*\{.*?\}\s*/, pageable[0])
                  .replace(/\s*\{.*?\}\s*/, pageable[1]);

          if (temp !== url) {
            history.replace(temp);
            return;
          }
          url = temp;
        }
      }

      const resp = await genericRequest(url);
      setProjects(resp);
    },
    [history]
  );

  useEffect(() => {
    getProjects();
  }, [getProjects, props]);

  const handleCreateProject = () => {
    return (
      <Link to={{ pathname: '/createProject', state: projects.actions }}>
        <button className='ui icon button' style={{ marginLeft: '50%' }}>
          Create Project
        </button>
      </Link>
    );
  };

  const handleChangePage = (url) => {
    history.push(url);
  };

  const handleOnDetails = (name) => {
    return (
      <Link to={`/projects/${name}`}>
        <button>View</button>
      </Link>
    );
  };

  const renderTableBody = () => {
    let number = 1;
    return projects.properties.projects.map((properties) => {
      const { name, description } = properties.properties;
      return (
        <tr key={name}>
          <td>{number++}</td>
          <td>{name}</td>
          <td>{description}</td>
          <td>{handleOnDetails(name)}</td>
        </tr>
      );
    });
  };

  const renderFooter = () => {
    const { links } = projects;

    function previous() {
      return (
        links[0].rel[0] === 'previous' && (
          <>
            <div
              className='icon item'
              onClick={() => handleChangePage(links[0].href)}
            >
              <i aria-hidden='true' className='chevron left icon'></i>
            </div>
            <div className='item'>{links[1].href.match(/\d+/)}</div>
          </>
        )
      );
    }

    function self() {
      return (
        links[0].rel[0] === 'self' && (
          <div className='item'>{links[0].href.match(/\d+/)}</div>
        )
      );
    }

    function next() {
      return (
        links[links.length - 1].rel[0] === 'next' && (
          <div
            className='icon item'
            onClick={() => handleChangePage(links[links.length - 1].href)}
          >
            <i aria-hidden='true' className='chevron right icon'></i>
          </div>
        )
      );
    }

    return (
      <tr>
        <th colSpan='4'>
          {handleCreateProject()}
          <div className='ui pagination right floated menu'>
            {previous()}
            {self()}
            {next()}
          </div>
        </th>
      </tr>
    );
  };

  return (
    projects && (
      <>
        <table className='ui celled table' style={{ padding: '30px' }}>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>{renderTableBody()}</tbody>
          <tfoot>{renderFooter()}</tfoot>
        </table>
      </>
    )
  );
};

export default Projects;
