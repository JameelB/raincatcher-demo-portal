/**
* CONFIDENTIAL
* Copyright 2016 Red Hat, Inc. and/or its affiliates.
* This is unpublished proprietary source code of Red Hat.
**/
'use strict';

var _ = require('lodash');

module.exports = 'app.group';

angular.module('app.group', [
  'ui.router'
, 'wfm.core.mediator'
])

.config(function($stateProvider) {
  $stateProvider
    .state('app.group', {
      url: '/groups',
      resolve: {
        groups: function(groupClient) {
          return groupClient.list();
        },
        users: function(userClient) {
          return userClient.list();
        },
        membership: function(membershipClient) {
          return membershipClient.list();
        }
      },
      views: {
        column2: {
          templateUrl: 'app/group/group-list.tpl.html',
          controller: 'groupListController as ctrl'
        },
        'content': {
          templateUrl: 'app/group/empty.tpl.html',
        }
      }
    })
    .state('app.group.detail', {
      url: '/group/:groupId',
      resolve: {
        group: function($stateParams, groups) {
          return groups[$stateParams.groupId];
        }
      },
      views: {
        'content@app': {
          templateUrl: 'app/group/group-detail.tpl.html',
          controller: 'groupDetailController as ctrl'
        }
      }
    })
    .state('app.group.edit', {
      url: '/group/:groupId/edit',
      resolve: {
        group: function($stateParams, groups) {
          return groups[$stateParams.groupId];
        }
      },
      views: {
        'content@app': {
          templateUrl: 'app/group/group-edit.tpl.html',
          controller: 'groupFormController as ctrl',
        }
      }
    })
    .state('app.group.new', {
      url: '/new',
      resolve: {
        group: function() {
          return {}
        }
      },
      views: {
        'content@app': {
          templateUrl: 'app/group/group-edit.tpl.html',
          controller: 'groupFormController as ctrl',
        }
      }
    });
})

.run(function($state, mediator) {
  mediator.subscribe('group:selected', function(group) {
    $state.go('app.group.detail', {
      groupId: group.id
    });
  });
})

.controller('groupListController', function (mediator, groups) {
  this.groups = groups;
})

.controller('groupDetailController', function ($state, $mdDialog, mediator, group, users, membership, groupClient) {
  var self = this;
  self.group = group;
  var groupMembership = membership.filter(function(_membership) {
    return _membership.group == group.id
  });
  self.members = users.filter(function(user) {
    return _.some(groupMembership, function(_membership) {
      return _membership.user == user.id;
    })
  });
  self.delete = function($event, group) {
    $event.preventDefault();
    var confirm = $mdDialog.confirm()
          .title('Would you like to delete group #'+group.id+'?')
          .textContent(group.name)
          .ariaLabel('Delete Group')
          .targetEvent($event)
          .ok('Proceed')
          .cancel('Cancel');
    $mdDialog.show(confirm).then(function() {
      groupClient.delete(group).then(function() {
        $state.go('app.group', null, {reload: true});
      }, function(err) {
        throw err;
      })
    });
  };
})

.controller('groupFormController', function ($state, mediator, group, groupClient) {
  var self = this;
  self.group = angular.copy(group);
  self.done = function(valid) {
    if (valid) {
      if (self.group.id || self.group.id === 0) {
        groupClient.update(self.group)
        .then(function() {
          $state.go('app.group.detail', {groupId: self.group.id}, {reload: true});
        })
      } else {
        groupClient.create(self.group)
        .then(function(createdGroup) {
          $state.go('app.group.detail', {groupId: createdGroup.id}, {reload: true});
        })
      }
    }
  };
})

;
